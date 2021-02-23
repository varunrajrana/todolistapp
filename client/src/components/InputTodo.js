import React,{ Fragment, useState } from 'react'

export default function InputTodo(){

    const [description,setDescription] = useState("")

    const [selectedFile, setSelectedFile] = useState();
	const [isFilePicked, setIsFilePicked] = useState(false);

    const changeHandler = (event) => {
		setSelectedFile(event.target.files[0]);
		setIsFilePicked(true);
	};

    const handleSubmission = () => {
		const formData = new FormData();

		formData.append('pdf', selectedFile);

		fetch(
			'http://localhost:5000/upload',
			{
				method: 'POST',
                body: formData
			}
		)
			.then((response) => response.json())
			.then((result) => {
				console.log('Success:', result);
			})
			.catch((error) => {
				console.error('Error:', error);
			});
	};
	

    const onSubmitForm = async(e) => {
        e.preventDefault();
        try {
            const body = {description};
            const response = await fetch("http://localhost:5000/todo",{
                method:"POST",
                headers: {"Content-Type":"application/json"},
                body: JSON.stringify(body)
            });
            window.location = "/";
        } catch (err) {
            console.error(err.message);
        }
    }
    

    return (
        <Fragment>
            <h1 className="text-center mt-5">PERN Todo list</h1>
            <form className="d-flex mt-5" onSubmit={onSubmitForm}>
                <input type="text" className="form-control" value={description} onChange={e=>setDescription(e.target.value)}  />
                <button className="btn btn-success">Add</button>
            </form>
            <form className="d-flex mt-3">
			<input className="form-control mt-2" type="file" name="file" onChange={changeHandler} />
			<button className="btn btn-primary" onClick={handleSubmission}>Submit</button>
            </form>
            {isFilePicked ? (
				<div>
					<p>Filetype: {selectedFile.type}</p>
					<p>Size in bytes: {selectedFile.size}</p>
				</div>
			) : (
				<p>Select a resume to upload</p>
			)}
        </Fragment>
    );
};