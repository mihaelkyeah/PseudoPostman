/* --------------------- PREPARE REQUEST --------------------- */
    let requestObject = {
        "request_headers": [],
        "request_bodyparams": [],
        "method": "GET",
        "baseURL": "",
        "endpoint": ""
    };

/* --------------------- DOM OPERATIONS --------------------- */
    // GET ELEMENTS
    let addHeaderName = document.querySelector('#add-header-name');
    let addHeaderValue = document.querySelector('#add-header-value');
    let addHeaderButton = document.querySelector('#add-header-button');
    let clearAllHeaders = document.querySelector('#clearall-request_headers');

    let addBodyParamName = document.querySelector('#add-bodyparam-name');
    let addBodyParamValue = document.querySelector('#add-bodyparam-value');
    let addBodyParamButton = document.querySelector('#add-bodyparam-button');
    let clearAllBodyParams = document.querySelector('#clearall-request_bodyparams');

    let baseURLField = document.querySelector('#base-url');
    let endpointField = document.querySelector('#endpoint');
    let methodSelect = document.querySelector('#method');
    let sendRequestButton = document.querySelector('#send-request-button');

    methodSelect.className = methodSelect.options[methodSelect.selectedIndex].className;
    methodSelect.addEventListener('change', () => {
        methodSelect.className = methodSelect.options[methodSelect.selectedIndex].className;
        requestObject.method = methodSelect.value;
    });

    baseURLField.addEventListener('keyup', () => {
        requestObject.baseURL = baseURLField.value;
    });
    endpointField.addEventListener('keyup', () => {
        requestObject.endpoint = endpointField.value;
    });

    // ADD HEADER
    addHeaderButton.addEventListener('click', () => { verifyAndAdd("request_headers", addHeaderName, addHeaderValue); });
    // ADD BODY PARAMETER
    addBodyParamButton.addEventListener('click', () => { verifyAndAdd("request_bodyparams", addBodyParamName, addBodyParamValue); });
    // CLEAR HEADERS
    clearAllHeaders.addEventListener('click', () => { clearAll("request_headers"); });
    // CLEAR BODY PARAMETERS
    clearAllBodyParams.addEventListener('click', () => { clearAll("request_bodyparams"); });
    // SEND REQUEST BUTTON
    sendRequestButton.addEventListener('click', () => { sendRequest(); })

    // VERIFY AND ADD FIELDS
    function verifyAndAdd(tableBodyId, nameField, valueField) {
        // Check if any fields are empty
        let verify = verifyFields(nameField, valueField);
        // Add field to request if it doesn't already exist
        verify = verify ? addFieldToRequest(nameField, valueField, tableBodyId) : false;
        // If both checks have succeeded, the new header/bodyparam will be added to its respective table
        if(verify) {
            addRowToTable(tableBodyId, nameField.value, valueField.value); // Adds row to table
            nameField.value = ""; // Empties name field
            valueField.value = ""; // Empties value field
            showClearAll(tableBodyId); // Shows "Clear All" button
            return true; // Reports success
        }
        return false; // Reports failure
    }

    // VERIFY IF FIELDS ARE NOT EMPTY
    function verifyFields(nameField, valueField) {

        if(nameField.value === "" || nameField.value === null || nameField.value === undefined)
            alert('The "name" parameter must not be empty.');
        else if(valueField.value === "" || valueField.value === null || valueField.value === undefined)
            alert('The "value" parameter must not be empty.');
        else
            return true; // Reports success if neither field is empty
        return false; // Reports failure if any field is empty
    }

    // ATTEMPT TO ADD A HEADER/BODYPARAM TO REQUEST OBJECT
    function addFieldToRequest(nameField, valueField, arrayToAddParamTo) {
        let found = false;
        // Attempts to find field to be added in the request object if it exists
        if(requestObject[arrayToAddParamTo].length > 0) {
            requestObject[arrayToAddParamTo].forEach((element) => {
                if(element.name === nameField.value) {
                    alert('The header / body parameter already exists.');
                    found = true;
                }
            });
        }
        // If the field does not exist, it is added to the request object
        if(!found)
        {
            let paramObject = {
                "name": nameField.value,
                "value": valueField.value
            };
            requestObject[arrayToAddParamTo].push(paramObject);
            return true; // Reports success (field was added)
        }
        return false; // Reports failure (field already exists)
    }

    // ADD ROW TO TABLE FOR STATUS VISIBILITY
    function addRowToTable(tableBodyId, name, value) {

        let row = document.createElement('tr');
        row.setAttribute('data-name', name);
        row.setAttribute('data-value', value);

        let nameCell = document.createElement('td');
        nameCell.innerHTML = name;

        let valueCell = document.createElement('td');
        valueCell.innerHTML = value;

        let removeCell = document.createElement('td');
        removeCell.innerHTML = "➖";
        removeCell.setAttribute('data-table-body-id', tableBodyId);
        removeCell.setAttribute('data-name', name);
        removeCell.classList.add('remove-cell');
        removeCell.addEventListener('click', () => {
            removeRowFromTable(tableBodyId, name);
            removeFieldFromRequest(tableBodyId, name);
        });

        row.appendChild(nameCell);
        row.appendChild(valueCell);
        row.appendChild(removeCell);

        document.querySelector('#'+tableBodyId).appendChild(row);
    }

    // SHOW "CLEAR ALL" BUTTON IN RESPECTIVE TABLE
    function showClearAll(tableBodyId) {
        let clearAllButton = document.querySelector('#clearall-'+tableBodyId);
        if(clearAllButton.hasAttribute('hidden'))
            clearAllButton.removeAttribute('hidden');
    }

    // REMOVE ROW FROM TABLE
    function removeRowFromTable(tableBodyId, name) {
        let rows = document.querySelector('#'+tableBodyId).getElementsByTagName('tr');
        Array.prototype.forEach.call(rows, (row) => {
            if(row.getAttribute('data-name') === name)
                row.remove();
        });
    }

    // REMOVE FIELD FROM REQUEST OBJECT
    function removeFieldFromRequest(arrayToRemoveParamFrom, name) {
        if(requestObject[arrayToRemoveParamFrom].length > 0) {
            for(let i = 0; i < requestObject[arrayToRemoveParamFrom].length; i++) {
                if(requestObject[arrayToRemoveParamFrom][i].name === name)
                    requestObject[arrayToRemoveParamFrom] = requestObject[arrayToRemoveParamFrom].splice(i, i);
            }
        }
    }

    // CLEAR ALL FIELDS FROM HEADERS/BODYPARAMS
    function clearAll(whatToClear) {
        requestObject[whatToClear] = [];
        document.querySelector('#'+whatToClear).innerHTML = "";
        document.querySelector('#clearall-'+whatToClear).setAttribute('hidden', true);
    }

/* --------------------- (END) DOM OPERATIONS (END) --------------------- */

/* --------------------- AJAX/REST --------------------- */

    function sendRequest() {

        // Preparing data
        
        // console.log(requestObject);
        
        let headers = {
            "accept": "Application/JSON",
            "Content-Type": "Application/JSON",
            "Access-Control-Allow-Origin": "*"
        };
        try {
            Array.prototype.forEach.call(requestObject.request_headers, (header) => {
                headers[header.name] = header.value;
            });
        } catch(e) { console.log(e) }

        let bodyData = {};
        try {
            Array.prototype.forEach.call(requestObject.request_bodyparams, (param) => {
                bodyData[param.name] = param.value;
            });
        } catch(e) { console.log(e) }
        
        // console.log(headers);
        // console.log(bodyData);
        // alert('Lorem Input');

        // Preparing and running request

        fetch(requestObject.baseURL+"/"+requestObject.endpoint, {
            "method": requestObject.method,
            "headers": JSON.stringify(headers),
            "body": JSON.stringify(bodyData),
            "mode": "cors"            
        }).then(response => {
            if (!response.ok) {
                error_msg = (response.status < 500) ? 'Bad request' : 'Internal server error';
                throw new Error(error_msg)
              }
              else
                return response.json() 
        }).then((json) => {
            document.querySelector('#json_response').innerHTML = "";
            document.querySelector('#json_response').innerHTML = json;
        });
    }

/* --------------------- (END) AJAX/REST (END) --------------------- */