/**
 * File upload class
 *
 * @author : redgoose
 * @param {String} action 파일처리 백엔드 url
 * @param {File} file
 * @param {Function} callback
 * @return void
 */
var FileUpload = function(action, file, callback)
{
	var xhr = new XMLHttpRequest();

	if (typeof FormData === 'function' || typeof FormData === 'object')
	{
		var formData = new FormData();
		formData.append('file', file);

		xhr.open('post', action, true);
		xhr.upload.addEventListener('progress', function(e){
			if (callback)
			{
				callback('progress', uploadProgress(e), file);
			}
		}, false);
		xhr.addEventListener('load', function(e){
			if (callback)
			{
				callback('complete', uploadSuccess(e.target), file);
			}
		});
		xhr.send(formData);
	}
	else
	{
		if (callback)
		{
			callback('complete', {
				state : 'error',
				message : 'not support browser'
			});
		}
	}
};


/**
 * upload progress
 * 
 * @Param {XMLHttpRequestProgressEvent} e
 * @Return {object}
 */
var uploadProgress = (e) => {
	if (e.lengthComputable)
	{
		return { loaded : e.loaded, total : e.total };
	}	
};


/**
 * upload success
 *
 * @Param {XMLHttpRequestProgressEvent} e
 * @Param {File} file
 * @Return {Object}
 */
var uploadSuccess = (e, file) => {
	if (e.readyState == 4)
	{
		switch (e.status)
		{
			case 200:
				try {
					return {
						state : 'success',
						result : JSON.parse(e.responseText)
					};
				} catch(e) {
					return {
						state : 'error',
						message : e.responseText
					};
				}
				break;
			case 404:
				return {
					state : 'error',
					message : '404 - File not found'
				};
				break;
			case 403:
				return {
					state : 'error',
					message : '403 - Forbidden file type'
				};
				break;
			default:
				return {
					state : 'error',
					message : 'Unknown Error'
				};
				break;
		}
	}

	return {
		state : 'error',
		message : 'Unknown Error'
	};
};


// export
module.exports = FileUpload;