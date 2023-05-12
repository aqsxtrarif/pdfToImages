import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Form() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [myFile, setMyFile] = useState('');
    const [uploadId, setUploadId] = useState('');
    const [uploadData, setUploadData] = useState(null);
    const [images, setImages] = useState([]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('myFile', myFile);
        formData.append('fullName', name);
        formData.append('email', email);

        try {
            const response = await axios({
                method: 'post',
                url: 'http://localhost:3001/uploadForm',
                data: formData,
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            if (response.data.success) {
                setUploadId(response.data.upload._id);
            }
        } catch (error) {
            console.error('Error uploading file:', error);
        }
    };

    useEffect(() => {
        const fetchPdfData = async () => {
            if (uploadId) {
                try {
                    const response = await axios.get(`http://localhost:3001/pdf/${uploadId}`);
                    if (response.data.upload) {
                        setUploadData(response.data.upload);
                        setImages(response.data.images);
                    }
                } catch (error) {
                    console.error('Error retrieving PDF and images:', error);
                }
            }
        };

        fetchPdfData();
    }, [uploadId]);

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} />

                <input type="email" placeholder="Your Email" value={email} onChange={(e) => setEmail(e.target.value)} />

                <input type="file" required={true} name="myFile" onChange={(e) => setMyFile(e.target.files[0])} />

                <input type="submit" value="Submit" />
            </form>

            {uploadData && (
                <div className='pdf'>
                    <h3>PDF Information:</h3>
                    <div className="pdfinfo">
                        <p>Filename: {uploadData.filename}</p>
                        <p>Full Name: {uploadData.fullName}</p>
                        <p>Email: {uploadData.email}</p>
                    </div>
                </div>
            )}

            {images.length > 0 && (
                <div className='pdfimages'>
                    <h3>PDF Images:</h3>
                    <div className="images">
                        {images.map((image) => (
                            <img src={`data:image/png;base64,${image.data}`} alt="PDF" key={image._id} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Form;
