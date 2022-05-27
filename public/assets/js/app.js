var createUser = (user) => {
    // console.log("Sending fetch request to the API endpoint")
    return fetch('/api/createUser', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(user)
        // body data type must match "Content-Type" header
    }).then(response => response);
}
// Fetch for processing csv files
var requestProcessTrialFiles = (targetTrial) => {
    // console.log("Sending fetch request to process trial files")
    return fetch('/parsePopulateProcess', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(targetTrial)
        // body data type must match "Content-Type" header
    }).then(response => response);
}
// Fetch for downloading raw csv files
var fetchRawCsvFiles = (targetTrial) => {
    return fetch('/downloadRawCsv', {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        mode: 'cors', // no-cors, cors, *same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        headers: {
            'Content-Type': 'application/json'
        },
        credentials: 'same-origin', // include, *same-origin, omit
        redirect: 'follow', // manual, *follow, error
        referrer: 'no-referrer', // no-referrer, *client
        body: JSON.stringify(targetTrial)
        // body data type must match "Content-Type" header
    }).then(response => response);
}
if (document.getElementById('adminHome') != null) {
    createUserModal = document.getElementById('')
    createUserButton = document.getElementById('onboardbutton')
    createUserButton.addEventListener('click', function () {
        console.log("Create User Button Pressed")
        uid = document.getElementById('uid').value
        subject = new Object()
        subject.uid = uid.trim()
        if (!uid)
            console.log("Error, the uid field is empty")
        else
            console.log("UID fetched is ", subject.uid)
        // Send FETCH API reques and handle the promise
        createUser(subject).then((data) => {
            // If response is ok/success
            if (data.status == 200) {
                console.log("User has been successfully created")
                // Notification that user has been added and close the form and reload the page
                // Close the add user form
                $('#onboardModal').modal('toggle') // Form Modal
                $('#onboardModalSuccess').modal('toggle') // Success Modal

            } else {
                $('#onboardModalFailure').modal('toggle') //Failure Modal
            }
        }).catch(async (error) => {
            $('#onboardModalFailure').modal('toggle') //Failure Modal
            console.error(error)
        });
    })
}

if (document.getElementById('subjectSessionList') != null) {
    // Download the output graph results
    downloadOutputImgZipped = async (sessionId) => {
        // console.log("Will find the images for session id ", sessionId)
        targetURL = "/downloadOutputImg?sessionId=" + sessionId
        // For Session download open in new tab
        window.open(targetURL);
    }
    // Process the raw .csv files
    processTrialFiles = async (sessionId) => {
        try {
            // Get the query subjectID of the current window
            $('#notificationStartProcess').modal('toggle')
            // Payload Object containing sessionId and subjectId
            targetTrial = {}
            // Extracting subjectId from the URL
            targetTrial.subjectId = (window.location.search).split("=")[1]
            targetTrial.sessionId = sessionId
            requestProcessTrialFiles(targetTrial).then((data) => {
                // console.log(data)
                if (data.status == 200) {
                    $('#notificationStartProcess').modal('toggle')
                    $('#processSuccess').modal('toggle') // Process Success Modal
                } else if (data.status == 500) {
                    $('#notificationStartProcess').modal('toggle')
                    $('#processFailure').modal('toggle') // Process Failure Modal
                }
            })
        } catch (error) {
            console.log(error)
        }
    }
    // Download raw .csv files
    downloadRawCsv = async (sessionId) => {
        try {
            // Payload Object containing sessionId and subjectId
            targetTrial = {}
            // Extracting subjectId from the URL
            targetTrial.subjectId = (window.location.search).split("=")[1]
            targetTrial.sessionId = sessionId
            targetURL = "/downloadRawCsv?sessionId=" + targetTrial.sessionId + "&subjectId=" + targetTrial.subjectId
            // For Session download open in new tab
            window.open(targetURL);
        } catch (error) {
            console.log(error)
        }
    }
}

