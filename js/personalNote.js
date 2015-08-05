window.onload = usingNote;
function usingNote(){
	if(window.document.cookie){
		var cookieList = getCookie();
		groupEdition.style.left = cookieList["currentGroupEditionLeft"];
		noteContentEdition.style.left = cookieList[" currentNoteContentEditionLeft"];
		contentDisplay.style.left = cookieList[" currentContentDisplay"];	
	}
	//新建分组
	//点击“新建分组”按钮出现编辑分组的界面
	var newGroupButton = window.document.getElementById("groupButton");
	newGroupButton.onclick = showGroupEdition;
	//编辑分组名，使用localStorage存储数据并完成，界面跳转至新建的分组界面
}
function showGroupEdition(){
	var groupEdition = window.document.getElementById("groupEdition");
	var noteContentEdition = window.document.getElementById("noteContentEdition");
	var contentDisplay = window.document.getElementById("contentDisplay");
	groupEdition.style.left = "15%";
	noteContentEdition.style.left = "2000px";
	contentDisplay.style.left = "-2000px";
	//cookie保存当前页面状态
	window.document.cookie = "currentGroupEditionLeft=15%";
	window.document.cookie = "currentNoteContentEditionLeft=2000px";
	window.document.cookie = "currentContentDisplay=-2000px";
}
//获取存储cookie名/值对的对象
function getCookie(){
	var cookie = {};
	if(window.document.cookie=="")return cookie;
	var cookieCouple = window.document.cookie.split(";");
	for(var i=0;i<cookieCouple.length;i++){
		var index = cookieCouple[i].indexOf("=");
		var name = cookieCouple[i].substring(0,index);
		var value = cookieCouple[i].substring(index+1);
		cookie[name] = value;
	}
	return cookie;
}