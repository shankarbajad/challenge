import './hello.css';

import React, {useState, useEffect} from 'react'

export default function Hello() {

	const [state, setState] = useState({
		imageList: [],
		storeImageList: []
	})

	useEffect(()=>{
		getImageList()
	},[])

	// This method for get image list from the localstorage
	const getImageList = () => {
		if(localStorage.getItem('storeImageList')){
			var storeImageList = JSON.parse(localStorage.getItem('storeImageList'));
			setState({
				...state,
				storeImageList
			})
		}
	}


	// This method for upload image from the browse button
	const handeUploadImage = (file) => {
        var imageList = state.imageList;
        var files = file.target.files;

        for(let i in files){
            let reader = new FileReader();
            let file = files[i];
            reader.onloadend = () => {
                var img = new Image();
                var _URL = window.URL || window.webkitURL;
                img.src = _URL.createObjectURL(file);
                 img.onload = (function(){
                    return async function(){ 
                        await imageList.push({
                            path: reader.result,
                            name: file.name,
                            size: file.size,
                            type: file.type
                        })
                        
                        setState({
                            ...state,
                            imageList,
                        })
                    }
                })(i);
            }
            reader.readAsDataURL(file)
        }
    }

    useEffect(()=>{
    	if(state.notification){
    		setTimeout(()=>{
	    		setState({
	    			...state,
	    			notification: false
	    		})
	    	}, 3000)
    	}
    },[state.notification])

    // This image for store image in localstorage as well as state
    const saveImages = (e) => {
    	e.preventDefault();
    	var storeImageList = state.storeImageList;
    	var imageList = state.imageList;
    	if(imageList.length===0){
    		alert('No Images selected')
    		return null
    	}

    	storeImageList = [...storeImageList, ...imageList]

    	setState({
    		...state,
    		imageList: [],
    		storeImageList,
    		notification: 'Image uploaded successfully !'
    	})

    	document.getElementById('file').value = ''
    	localStorage.setItem('storeImageList', JSON.stringify(storeImageList))
    	
    }

    // This method for delete image from the localsotrage as well as state
    const handleDeleteImage = (e, index) => {
    	e.preventDefault();
    	if(!window.confirm('Are you sure want to delete')){
    		return null
    	}

    	var storeImageList = state.storeImageList;
    	storeImageList.splice(index, 1)
    	setState({
    		...state,
    		storeImageList,
    		notification: 'Image deleted successfully !'
    	})

    	localStorage.setItem('storeImageList', JSON.stringify(state.imageList))
    }


  return (
  		<div className='container'>
		    <form>
		    	{
		    		state.notification && 
		    		<div class="alert alert-success notification-msg" role="alert">
					  {state.notification}
					</div>
		    	}
		    	<div class="form-group">
		    		<label 
		    			htmlFor="file"
		    			className='form-control-file'
		    		>
		    			Select images:
		    		</label>
					<input 
						type='file' 
						id="file"
						onChange={(e)=>handeUploadImage(e)}
						name='upload image'
						accept="image/png"
						multiple
					/>
		    	</div>
				<button onClick={(e)=>saveImages(e)} class="btn btn-success">Upload</button>
				<table className='table mr-20'>
					<thead>
						<tr>
							<th>SN</th>
							<th>Name</th>
							<th>Image</th>
							<th>Size</th>
							<th>Type</th>
							<th>Action</th>
						</tr>
						{
							state.storeImageList && state.storeImageList.length>0 ?
							state.storeImageList.map((item, index)=>{
								return(
									<tr key={index}>
										<td>{index+1}</td>
										<td>{item.name}</td>
										<td>
											<img src={item.path} width='100px'/>
										</td>
										<td>{item.size}</td>
										<td>{item.type}</td>
										<td>
											<button 
												onClick={(e)=>handleDeleteImage(e, index)}
												className='btn btn-danger'
											>
												Delete
											</button>
										</td>
									</tr>
								)
							})
							:
							<tr>
								<td colSpan='5' textalign='center'>No Record uploaded</td>
							</tr>
						}
					</thead>
				</table>
			</form>
		</div>
  )
}
