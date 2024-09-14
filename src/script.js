const chat_container = document.querySelector('.chat-container');

const inputField = document.getElementById('myInput');
const getValueButton = document.getElementById('getValueButton');


getValueButton.addEventListener('click', () => {
    // Get the value from the input field
    const inputValue = inputField.value;
    ;
    // Display the value
    const msgSend = document.createElement('div');
    msgSend.classList.add('message');
    msgSend.classList.add('sender');

    msgSend.textContent = inputValue;
    chat_container.appendChild(msgSend);

    let value = inputField.value;

    inputField.value = '';
    sendMsg(value);



});

function generateUUID() {
    return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, c =>
        (c ^ crypto.getRandomValues(new Uint8Array(1))[0] & 15 >> c / 4).toString(16)
    );
}

const sendMsg = async (msg) => {

    try {
        const response = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: msg })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let result = '';

        // Create a function to handle the streamed data
        const handleStream = async () => {

            const msgElement = document.createElement('div');
            const uuid = generateUUID();
            msgElement.classList.add('message');
            msgElement.classList.add('receiver');
            const id = uuid;
            msgElement.id = id;
           
            chat_container.appendChild(msgElement);

            const getMsg = document.getElementById(id);

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;
                console.log(getMsg)
                getMsg.textContent += decoder.decode(value, { stream: true });
     }
           
        };

        handleStream();
    } catch (error) {
        console.error('Error fetching data:', error);
    }

}