import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'

const Info = () => {

    const [UsersFilesList, setUsersFileslist] = useState()
    const [filePathForIframe, setFilePathForIframe] = useState()
    const [showFile, setShowFile] = useState(false)
    const [fileInfo, setFileInfo] = useState()
    const [showInput, setShowInput] = useState(false)
    const [oldName, setOldName] = useState()
    const [newName, setNewName] = useState()
    const [path, setPath] = useState('/')

 
    const navigate = useNavigate()
    async function getUsersListOfFilesFromApi() {
        try {
            console.log('hi');
            const res = await fetch(`http://localhost:8080${path}`)
            console.log(path);
            navigate(`${path}`)
            const data = await res.json()
            setUsersFileslist(data)
        } catch (error) {
            alert(error, "network error")
        }
    }

    useEffect(() => {
        getUsersListOfFilesFromApi()
    }, [path])
    

    const previewFile = async (file) => {
        const res = await fetch(`http://localhost:8080/${path}${file.fileName}`)
        setFilePathForIframe(res.url)
        setShowFile(!showFile)
    }

    const getInfo = (file) => {
        setFileInfo(file)
        console.log(fileInfo);
    }

    const rename = (file) => {
        setShowInput(!showInput)
        setOldName(file.fileName)
    }

    const putNewName = () => {
        const body = {
            newName
        }
        fetch(`http://localhost:8080${path}${oldName}`, {
            method: "PUT",
            body: JSON.stringify(body),
            headers: { "Content-type": "application/json; charset=UTF-8" }
        })
            .then(response => response.json())
            .then(json => console.log(json));
    }

    const deleteFile = (file) => {
        fetch(`http://localhost:8080/${path}${file.fileName}`, {
            method: "DELETE",
        })
            .then(response => response.text())
            .then(json => alert(json));
    }

    const copyFile = (file) => {
        fetch(`http://localhost:8080/${path}${file.fileName}`, {
            method: "POST",
        })
            .then(response => response.json())
            .then(json => console.log(json));
    }

const goUp = ()=>{
    let aa = path.slice(0, path.lastIndexOf('/'))
    let bb = aa.slice(0, aa.lastIndexOf('/') +1)
    setPath(bb) 
}

    return (
        <div>
            <h3> list of files</h3>
            <h4>location {path} { path!=='/' && <button onClick={goUp}>go back</button>}</h4>
            {<table id="customers">
            <tbody>
                    <tr><th>folders</th></tr>
                    {UsersFilesList && UsersFilesList.map((file, idx) =>
                        <tr key={idx}>
                            {file.isDirectory ? <td>  {file.fileName}</td> : null}
                            {/* {file.isDirectory ? <td><button >show</button></td> : null} */}
                            {file.isDirectory ? <td><button
                                onClick={() => setPath(path +`${file.fileName}/`)}>
                                enter</button></td> : null}
                            {/* {file.isDirectory && path!=='/' ? <td>{<button onClick={goUp}>up</button>}</td> : null} */}
                            {file.isDirectory ? <td><button onClick={() => rename(file)}>rename</button></td> : null}
                            {showInput && oldName === file.fileName ? <td><input onChange={(e) => setNewName(e.target.value)}></input> <button type='submit' onClick={putNewName}>submit</button></td> : null}
                            {file.isDirectory ? <td><button onClick={() => deleteFile(file)}>delete</button></td> : null}
                        </tr>
                    )}
                </tbody>
                <tbody>
                    <tr><th>files</th></tr>
                    {UsersFilesList && UsersFilesList.map((file, idx) =>
                        <tr key={idx}>
                            {!file.isDirectory ?  <td>{file.fileName}</td>: null}
                            {!file.isDirectory ? <td><button onClick={() => getInfo(file)}>info</button></td> : null}
                            {!file.isDirectory ? <td><button onClick={() => previewFile(file)}> show/hide </button></td> : null}
                            {!file.isDirectory ? <td><button onClick={()=>copyFile(file)}>copy</button></td> : null}
                            {!file.isDirectory ? <td><button onClick={() => rename(file)}>rename</button></td> : null}
                            {showInput && oldName === file.fileName ?
                             <td><input onChange={(e) => setNewName(e.target.value)}></input>
                             <button type='submit' onClick={putNewName}>submit</button></td> : null}
                            {!file.isDirectory ? <td><button onClick={() => deleteFile(file)}>delete</button></td> : null}
                        </tr>
                    )}
                </tbody>
            </table>}
            <div>{fileInfo && `size in KB :${fileInfo.size}`}</div>

            {showFile && <iframe src={filePathForIframe} width="100%" height="400px" title='showFile'>
            </iframe>}
        </div>
    )
}
export default Info
