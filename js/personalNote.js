window.onload = usingNote;
function usingNote(){
	var noteLabel = window.document.getElementById("noteLabel");
	var groupEdition = window.document.getElementById("groupEdition");
	var noteContentEdition = window.document.getElementById("noteContentEdition");
	var contentDisplay = window.document.getElementById("contentDisplay");
	var classifications = window.document.getElementById("classifications");
	//localStorage.clear();
	loadContent();
	// 新建分组
	// 点击“新建分组”按钮出现编辑分组的界面
	var newGroupButton = window.document.getElementById("groupButton");
	newGroupButton.onclick = showGroupEdition;
	// 编辑分组名，使用localStorage存储数据并完成，界面跳转至新建的分组界面
	var finishButtonList = window.document.getElementsByClassName("finishButt");
	finishButtonList[1].onclick = finishGroupEdit;
	// 点击分组的叉号按钮删除该分组及其组内的笔记
	if(classifications.addEventListener){
		classifications.addEventListener("click",deleteGroup,false);
	}else if(classifications.attachEvent){
		classifications.attachEvent("onclick",deleteGroup);
	}
	// 点击分组按钮进入相应分组
	if(classifications.addEventListener){
		classifications.addEventListener("click",enterGroup,false);
	}else if(classifications.attachEvent){
		classifications.attachEvent("onclick",enterGroup);
	}
	// 点击新建笔记，开始创建笔记
	var list = window.document.getElementById("list");
	if(list.addEventListener){
		list.addEventListener("click",createNote,false);
	}else if(list.attachEvent){
		list.attachEvent("onclick",createNote);
	}
	// 创建笔记完成时点击“完成”按钮
	var finishContentButton = finishButtonList[0];
	if(finishContentButton.addEventListener){
		finishContentButton.addEventListener("click",finishContentEdit,false);
	}else if(finishContentButton.attachEvent){
		finishContentButton.attachEvent("onclick",finishContentEdit);
	}
}
//加载内容
function loadContent(){
	if(window.document.cookie){
		var cookieList = getCookie();
		//页面刷新时保持当前content页面
		groupEdition.style.left = cookieList["currentGroupEditionLeft"];
		noteContentEdition.style.left = cookieList[" currentNoteContentEditionLeft"];
		contentDisplay.style.left = cookieList[" currentContentDisplayLeft"];	
		noteLabel.style.left = cookieList[" currentNotelabelLeft"];
		//加载当前的分组和笔记
		/* if(window.document.getElementsByClassName("classificationTd")){
			
		} */
		var insertStr = "";
		for(var k=0;k<parseInt(localStorage.groupNum);k++){
			if(localStorage.getItem("group"+k)!=null)
				insertStr += localStorage.getItem("group"+k);
		}
		classifications.innerHTML = insertStr;//加载分组
		//加载noteList的标题名字以及笔记列表
		window.document.getElementsByTagName("h3")[0].innerHTML = localStorage.currentNoteListName;
		if(localStorage.currentList!=null)
		window.document.getElementById("list").innerHTML = localStorage.currentList;
		//加载展示笔记的内容
		var currentGroupName = window.document.getElementsByTagName("h3")[0];
		var currentNoteNum = localStorage.getItem(currentGroupName+"noteNum");
		contentDisplay.innerHTML = "<section class='title'><h1>"+localStorage.getItem("currentLabel")+"</h1><button class='modifyButton'></button><button class='deleteButton'></button></section>"
									+localStorage.getItem(currentGroupName+"note"+currentNoteNum+"content");
	}
}
//新建分组的处理程序
function showGroupEdition(){

	groupEdition.style.left = "15%";
	noteContentEdition.style.left = "2000px";
	contentDisplay.style.left = "-2000px";
	noteLabel.style.left = "2000px";
	//cookie保存当前content页面状态
	window.document.cookie = "currentGroupEditionLeft=15%";
	window.document.cookie = "currentNoteContentEditionLeft=2000px";
	window.document.cookie = "currentContentDisplayLeft=-2000px";
	window.document.cookie = "currentNotelabelleft=2000px";	
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
//点击完成，提交分组名称并创建新的分组
function finishGroupEdit(){
	var groupInput = window.document.getElementById("groupNameInput");
	if(groupInput.value){
		var num = window.document.getElementsByClassName("classificationTd").length;//获取当前分组的数目
		classifications.innerHTML = "<div class='classificationTd' id='group"+num+"'>"+groupInput.value+"<button alt='删除分组'></button></div>";
		//将创建的分组存储起来，groupList保存创各个分组
		//localStorage.groupList += "<div class='classificationTd' id='group"+num+"'>"+groupInput.value+"<button alt='删除分组'></button></div>";
		localStorage.setItem("group"+num,"<div class='classificationTd' id='group"+num+"'>"+groupInput.value+"<button alt='删除分组'></button></div>");
		localStorage.groupNum = num+1;//记录当前的分组数
		//将内容显示部分切换为分组的显示
		var contentList = window.document.getElementsByClassName("noteContent");
		for(var j=0;j<contentList.length;j++){
			if(j==3){
				contentList[j].style.left = "15%";
				window.document.cookie = "currentNotelabelLeft=15%";
			}else{
				contentList[j].style.left = "2000px";
				window.document.cookie = "currentNoteContentEditionLeft=2000px";
				window.document.cookie = "currentGroupEditionLeft=2000px";
				window.document.cookie = "currentContentDisplayLeft=2000px";				
			}
		}
		//单击“完成”后，加载当前的分组和笔记
		window.document.getElementsByTagName("h3")[0].innerHTML = groupInput.value;
		window.document.getElementById("list").innerHTML = "<input type='button' value='新建笔记'></input>";
		var insertStr = "";
			for(var k=0;k<parseInt(localStorage.groupNum);k++){
				if(localStorage.getItem("group"+k)!=null)
					insertStr += localStorage.getItem("group"+k);
			}
			classifications.innerHTML = insertStr;
	}
}
//删除指定分组以及其分组中的所有笔记（未完成删除相应分组的笔记）
function deleteGroup(event){
	if(event.target.tagName == "BUTTON"){
		if(window.confirm("确定要删除这个分组以及其分组内的所有笔记？")==true){
			var deleteTarget = event.target.parentNode;
			var deleteId = deleteTarget.id;
			event.target.parentNode.parentNode.removeChild(deleteTarget);
			if(navigator.appName.indexOf("Explorer")>-1)//IE下获取div中的文本
				var delGroupName = deleteTarget.innerText;
			else 
				var delGroupName = deleteTarget.textContent;//其他浏览器下获取
			var hName = window.document.getElementsByTagName("h3")[0];
			if(delGroupName == hName.innerHTML)hName.innerHTML = "";
			//删除localStorage中应该被删除的元素
			localStorage.removeItem(deleteId);
			//阻止事件冒泡
			if(event.stopPropagation)event.stopPropagation();
			cancelBubble = true;//IE
		}
	}
}
//点击进入相应分组的处理函数
function enterGroup(event){
	if(navigator.appName.indexOf("Explorer")>-1)//IE下获取div中的文本
		var groupName = event.target.innerText;
	else 
		var groupName = event.target.textContent;//其他浏览器下获取
	if(event.target.className == "classificationTd"){
		var groupStr = event.target.id;
		//alert(localStorage.getItem(groupName+"realNoteNum"));
		if(localStorage.getItem(groupName+"realNoteNum")!=null){
			var noteNum = parseInt(localStorage.getItem(groupName+"noteNum"));
			var list = window.document.getElementById("list");
			var listStr = "";
			//加载list中的笔记
			for(var i1=0;i1<noteNum;i1++){
				if(localStorage.getItem(groupName+"note"+i1)!=null)
					listStr += localStorage.getItem(groupName+"note"+i1);
			}
			listStr += "<input type='button' value='新建笔记'></input>";
			list.innerHTML = listStr;
			localStorage.currentList = listStr;
		}
		if(localStorage.getItem(groupName+"realNoteNum")==null){
			var list = window.document.getElementById("list");
			list.innerHTML = "<input type='button' value='新建笔记'></input>";
			localStorage.currentList = "<input type='button' value='新建笔记'></input>";
		}
		//切换内容区
		var contentList = window.document.getElementsByClassName("noteContent");
		for(var j1=0;j1<contentList.length;j1++){
			if(j1==3){
				contentList[j1].style.left = "15%";
				window.document.cookie = "currentNotelabelLeft=15%";
			}else{
				contentList[j1].style.left = "2000px";
				window.document.cookie = "currentNoteContentEditionLeft=2000px";
				window.document.cookie = "currentGroupEditionLeft=2000px";
				window.document.cookie = "currentContentDisplayLeft=2000px";				
			}
		}
		//笔记列表的标题相应改变
		localStorage.currentNoteListName = groupName;
		window.document.getElementsByTagName("h3")[0].innerHTML = groupName;
	}
	//取消冒泡
	if(event.stopPropagation)event.stopPropagation();
	event.cancelBubble = true;
}
//创建笔记
function createNote(event){
	if(event.target.tagName == "INPUT"){
		if(window.document.getElementsByClassName("classificationTd").length>0){
			//切换内容区为编辑笔记
			noteContentEdition.style.left="15%";
			groupEdition.style.left="2000px";
			contentDisplay.style.left="2000px";
			noteLabel.style.left="2000px";
			window.document.cookie = "currentNoteContentEditionLeft=15%";
			window.document.cookie = "currentContentDisplayLeft=2000px";
			window.document.cookie = "currentGroupEditionLeft=2000px";
			window.document.cookie = "currentNotelabelLeft=2000px";
		}
		//阻止冒泡
		if(event.stopPropagation)event.stopPropagation();
		event.cancelBubble = true;
	}
}
//完成笔记内容的编辑
function finishContentEdit(event){
	var labelInput = window.document.getElementById("labelInput");
	var noteEditArea= window.document.getElementById("noteContentArea");
	if(labelInput.value==""||noteEditArea.value=="")
		alert("请输入标题或笔记内容！");
	else{
		var currentGroupName = window.document.getElementsByTagName("h3")[0].innerHTML;
		//存储相应分组信息
		localStorage.setItem(currentGroupName+"noteNum",window.document.getElementsByClassName("noteTitle").length);//保存当前分组的笔记数
		var currentNoteNum = localStorage.getItem(currentGroupName+"noteNum");
		localStorage.setItem(currentGroupName+"note"+currentNoteNum+"title",labelInput.value);
		localStorage.setItem(currentGroupName+"note"+currentNoteNum,"<p class='noteTitle'>"+labelInput.value+"</p>");
		localStorage.setItem(currentGroupName+"note"+currentNoteNum+"content",
							"<textarea cols='146' rows='20' disabled='disabled' id='noteContentDisplay'>"
								+noteEditArea.value+"</textarea>");
		contentDisplay.innerHTML = "<section class='title'><h1>"+labelInput.value
									+"</h1><button class='modifyButton'></button><button class='deleteButton'></button></section>"
									+localStorage.getItem(currentGroupName+"note"+currentNoteNum+"content");
		localStorage.setItem("currentLabel",labelInput.value);
		alert(currentNoteNum);
		currentNoteNum = parseInt(currentNoteNum)+1;
		alert(currentNoteNum);
		localStorage.setItem(currentGroupName+"noteNum",currentNoteNum);
		localStorage.setItem(currentGroupName+"realNoteNum",currentNoteNum);//保存真实的笔记数，删除一个笔记时这个值要减1
		//笔记列表中添加笔记的标题
		var listStr = "";
		for(var k2=0;k2<(window.document.getElementsByClassName("noteTitle").length+1);k2++){
			if(localStorage.getItem(currentGroupName+"note"+k2)!=null)
				listStr += localStorage.getItem(currentGroupName+"note"+k2);
		}
		listStr += "<input type='button' value='新建笔记'></input>";
		window.document.getElementById("list").innerHTML = listStr;
		localStorage.currentList = listStr;//存储当期笔记列表的代码一边刷新重新加载
		//切换内容区为内容展示
		noteContentEdition.style.left="2000px";
		groupEdition.style.left="2000px";
		contentDisplay.style.left="15%";
		noteLabel.style.left="2000px";
		window.document.cookie = "currentNoteContentEditionLeft=2000px";
		window.document.cookie = "currentContentDisplayLeft=15%";
		window.document.cookie = "currentGroupEditionLeft=2000px";
		window.document.cookie = "currentNotelabelLeft=2000px";
		
	}
	//阻止事件冒泡
	if(event.stopPropagation)event.stopPropagation();
	cancelBubble = true;//IE
}