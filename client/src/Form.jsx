import React, { useState } from 'react';
import axios from 'axios';  

function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [myFile, setMyFile] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(name, email, myFile);

        const formData = new FormData();
        formData.append('myFile', myFile);
        formData.append('fullName', name);
        formData.append('email', email);

        await axios({
            method: 'post',
            url: 'http://localhost:3001/uploadForm',
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    }

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" placeholder='Your Name' value={name} onChange={(e) => setName(e.target.value)} />

            <input type="email" placeholder='Your Email' value={email} onChange={(e) => setEmail(e.target.value)} />

            <input type="file" required={true} name="myFile" onChange={(e) => setMyFile(e.target.files[0])} />

            <input type="submit" value="Submit" />
        </form>
    );
}

export default Form;
