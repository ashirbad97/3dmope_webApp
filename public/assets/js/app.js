var createUser = (user) => {
    console.log("Sending fetch request to the API endpoint")
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

            }
        }).catch(error => console.error(error));
    })
}