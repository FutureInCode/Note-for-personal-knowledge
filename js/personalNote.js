
window.onload = usingNote;
function usingNote(){
	var noteLabel = window.document.getElementById("noteLabel");
	var groupEdition = window.document.getElementById("groupEdition");
	var noteContentEdition = window.document.getElementById("noteContentEdition");
	var contentDisplay = window.document.getElementById("contentDisplay");
	var classifications = window.document.getElementById("classifications");
	//localStorage.clear();
	loadContent();
	// 点击“新建分组”按钮出现编辑分组的界面
	var newGroupButton = window.document.getElementById("groupButton");
	newGroupButton.onclick = showGroupEdition;
	// 新建分组结束，点击完成按钮
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
	//点击“取消”按钮取消编辑笔记
	var cancelButtonList = window.document.getElementsByClassName("cancelButt");
	var cancelContentButton = cancelButtonList[0];
	if(cancelContentButton.addEventListener){
		cancelContentButton.addEventListener("click",cancelEditContent,false);
	}else if(cancelContentButton.attachEvent){
			cancelContentButton.attachEvent("onclick",cancelEditContent);
	}
	//点击笔记的“删除”按钮
	if(contentDisplay.addEventListener){
		contentDisplay.addEventListener("click",deleteNote,false);
	}else if(contentDisplay.attachEvent){
		contentDisplay.attachEvent("onclick",deleteNote);
	}
	//点击笔记标题进入笔记
	var notesList = window.document.getElementById("list");
	if(notesList.addEventListener){
		notesList.addEventListener("click",showNote,false);
	}else if(notesList.attachEvent){
		notesList.attachEvent("onclick",showNote);
	}
}
//加载内容
function loadContent(){
	if(window.document.cookie){
		var cookieList = getCookie();
		//页面刷新时保持当前content页面
		keepCurrentPage(cookieList);
		//加载当前的分组
		loadCurrentGroupList();
		//加载noteList的标题名字以及笔记列表
		loadNoteList();
		//加载展示笔记的内容
		loadContentDisplay();
	}
}
//加载当前的分组列表
function loadCurrentGroupList(){
	if(localStorage.groupList!=null){
		var groupCode = "";
		var localGroupList = JSON.parse(localStorage.groupList);
		localGroupList.forEach(function(item,index,array){
			groupCode += "<div class='classificationTd'>"
						+item+"<button alt='删除分组'></button></div>";
		});
		classifications.innerHTML = groupCode;
	}
}
//加载当前分组中的笔记列表
function loadNoteList(){
	if(localStorage.getItem(localStorage.currentGroup)!=null){
		window.document.getElementsByTagName("h3")[0].innerHTML = localStorage.currentGroup;
		var currentNotesList = JSON.parse(localStorage.getItem(localStorage.currentGroup));
		var currentNoteListCode = "";
		currentNotesList.forEach(function(item,index,array){
			currentNoteListCode += "<p class='noteTitle'>"+item.name+"</p>"
		});
		currentNoteListCode += "<input type='button' value='新建笔记'></input>";
		window.document.getElementById("list").innerHTML = currentNoteListCode;
	}else
		window.document.getElementById("list").innerHTML ="<input type='button' value='新建笔记'></input>";
}
//加载展示笔记页面的内容
function loadContentDisplay(){
		if(localStorage.currentGroup != null){
			var newGroup = JSON.parse(localStorage.getItem(localStorage.currentGroup));
			var filterList = newGroup.filter(function(item,idex,array){
				if(item.name == localStorage.currentNoteName)return true;
			});
			var currentNote = filterList[0];
			contentDisplay.innerHTML = "<section class='title'><h1>"+currentNote.name
					+"</h1><button class='deleteButton'></button><textarea cols='146' rows='20' disabled='disabled'>"
					+currentNote.content+"</textarea>";
		}
}
//保持当前页面
function keepCurrentPage(cookieList){
		groupEdition.style.left = cookieList["currentGroupEditionLeft"];
		noteContentEdition.style.left = cookieList[" currentNoteContentEditionLeft"];
		contentDisplay.style.left = cookieList[" currentContentDisplayLeft"];	
		noteLabel.style.left = cookieList[" currentNotelabelLeft"];
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
		if(localStorage.groupList==null)var localGroupList = [];
		else var localGroupList = JSON.parse(localStorage.groupList);
		localGroupList[localGroupList.length] = groupInput.value;
		//分组列表中存储新的分组名
		save("groupList",localGroupList);
		//将内容显示部分切换为分组的显示
		var contentList = window.document.getElementsByClassName("noteContent");
		for(var j=0;j<contentList.length;j++){
			if(j==3){
				contentList[j].style.left = "15%";
			}else{
				contentList[j].style.left = "2000px";
			}
		}
		window.document.cookie = "currentNotelabelLeft=15%";
		window.document.cookie = "currentNoteContentEditionLeft=2000px";
		window.document.cookie = "currentGroupEditionLeft=2000px";
		window.document.cookie = "currentContentDisplayLeft=2000px";			
		//单击“完成”后，加载当前的分组和笔记
		localStorage.currentGroup = groupInput.value;//保存当前的分组名
		window.document.getElementsByTagName("H3")[0].innerHTML = localStorage.currentGroup;
		loadCurrentGroupList();
		loadNoteList();
	}
}
//将参数saveItem转化为字符串存在localStorage中的localStorageItem中去
function save(localStorageItem,saveItem){
	saveItem = JSON.stringify(saveItem);
	localStorage.setItem(localStorageItem,saveItem);
}
//从分组列表中删除指定参数的分组
function deleteFromGroupList(groupName){
	var localGroupList = JSON.parse(localStorage.groupList);
	localGroupList.forEach(function(item,index,array){
		if(item == groupName)array.splice(index,1);
	});
	save("groupList",localGroupList);
}
//从相应分组的笔记列表中删除笔记
function deleteFromNoteList(tarTitle,group){
	var localGroup = JSON.parse(localStorage.getItem(group));
	localGroup.forEach(function(item,index,array){
		if(item.name == tarTitle)array.splice(index,1);
	});
	save(group,localGroup);
}
//获取点击的按钮的值
function getTargetName(e){
	if(navigator.appName.indexOf("Explorer")>-1)//IE下获取div中的文本
		var tarName = e.target.innerText;
	else 
		var tarName = e.target.textContent;//其他浏览器下获取
	return tarName;
}
//删除指定分组以及其分组中的所有笔记
function deleteGroup(event){
	if(event.target.tagName == "BUTTON"){
		if(window.confirm("确定要删除这个分组以及其分组内的所有笔记？")){
			var deleteTarget = event.target.parentNode;
			event.target.parentNode.parentNode.removeChild(deleteTarget);
			if(navigator.appName.indexOf("Explorer")>-1)//IE下获取div中的文本
				var delGroupName = event.target.parentNode.innerText;
			else 
				var delGroupName = event.target.parentNode.textContent;//其他浏览器下获取
			var hName = window.document.getElementsByTagName("h3")[0];
			if(delGroupName == hName.innerHTML){
				hName.innerHTML = "";
				//切换内容区为contentDisplay界面
				noteContentEdition.style.left="2000px";
				groupEdition.style.left="2000px";
				contentDisplay.style.left="15%";
				noteLabel.style.left="2000px";
				window.document.cookie = "currentNoteContentEditionLeft=2000px";
				window.document.cookie = "currentContentDisplayLeft=15%";
				window.document.cookie = "currentGroupEditionLeft=2000px";
				window.document.cookie = "currentNotelabelLeft=2000px";
				contentDisplay.innerHTML = "<section class='title'><h1>欢迎使用web笔记本！</h1></section>";
				localStorage.currentDisplayCode = "<section class='title'><h1>欢迎使用web笔记本！</h1></section>";
				
				localStorage.currentGroup = null;
				localStorage.currentNoteName = null;
			}
			//删除localStorage的groupList中应该被删除的元素
			deleteFromGroupList(delGroupName);
			//删除分组内的所有笔记
			var delGroup = JSON.parse(localStorage.getItem(delGroupName));
			delGroup.splice(0,delGroup.length);
			save(delGroupName,delGroup);
			
			loadCurrentGroupList();
			loadNoteList();
			//阻止事件冒泡
			if(event.stopPropagation)event.stopPropagation();
			cancelBubble = true;//IE
		}
	}
}
//点击进入相应分组
function enterGroup(event){
	if(event.target.className == "classificationTd"){
		var groupName = getTargetName(event);
		localStorage.setItem("currentGroup",groupName);
		if(localStorage.getItem(groupName)!=null){
			loadCurrentGroupList();
			loadNoteList();
		}
		if(localStorage.getItem(groupName==null)){
			var list = window.document.getElementById("list");
			list.innerHTML = "<input type='button' value='新建笔记'></input>";
			localStorage.setItem("currentNoteTitleListCode","<input type='button' value='新建笔记'></input>");
		}
		//切换内容区
		var contentList = window.document.getElementsByClassName("noteContent");
		for(var j1=0;j1<contentList.length;j1++){
			if(j1==3){
				contentList[j1].style.left = "15%";
			}else{
				contentList[j1].style.left = "2000px";
		
			}
		}
		window.document.cookie = "currentNotelabelLeft=15%";
		window.document.cookie = "currentNoteContentEditionLeft=2000px";
		window.document.cookie = "currentGroupEditionLeft=2000px";
		window.document.cookie = "currentContentDisplayLeft=2000px";		
		//笔记列表的标题相应改变
		window.document.getElementsByTagName("h3")[0].innerHTML = groupName;
		//取消冒泡
		if(event.stopPropagation)event.stopPropagation();
		event.cancelBubble = true;
	}

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
		var currentGroupName = localStorage.currentGroup;
		//存储相应分组信息
		localStorage.currentNoteName = labelInput.value;
		var currentNoteList;
		if(localStorage.getItem(currentGroupName)==null)currentNoteList = [];
		else currentNoteList = JSON.parse(localStorage.getItem(currentGroupName));
		var saveNote = {};
		saveNote.name = labelInput.value;
		saveNote.content = noteEditArea.value;
		currentNoteList.push(saveNote);
		save(currentGroupName,currentNoteList);
		loadNoteList();
		loadCurrentGroupList();
		loadContentDisplay();
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
//点击“取消”按钮，如果是取消编辑分组则返回到笔记本的首页，如果是取消编辑笔记，则返回到分组首页
function cancelEditContent(event){
	//切换内容区为contentDisplay界面
		noteContentEdition.style.left="2000px";
		groupEdition.style.left="2000px";
		contentDisplay.style.left="15%";
		noteLabel.style.left="2000px";
		window.document.cookie = "currentNoteContentEditionLeft=2000px";
		window.document.cookie = "currentContentDisplayLeft=15%";
		window.document.cookie = "currentGroupEditionLeft=2000px";
		window.document.cookie = "currentNotelabelLeft=2000px";
		//阻止事件冒泡
		if(event.stopPropagation)event.stopPropagation();
		cancelBubble = true;//IE
}
//删除指定笔记
function deleteNote(event){
	if(event.target.className == "deleteButton"){
		if(confirm("确定删除笔记？")){
			var noteTitle = localStorage.currentNoteName;
			var currentGroupName = localStorage.currentGroup;
			deleteFromNoteList(noteTitle,currentGroupName);
			loadNoteList();
			//切换内容区
			var contentList = window.document.getElementsByClassName("noteContent");
			for(var j1=0;j1<contentList.length;j1++){
				if(j1==3){
					contentList[j1].style.left = "15%";
				}else{
					contentList[j1].style.left = "2000px";
				}
			}
			window.document.cookie = "currentNotelabelLeft=15%";
			window.document.cookie = "currentNoteContentEditionLeft=2000px";
			window.document.cookie = "currentGroupEditionLeft=2000px";
			window.document.cookie = "currentContentDisplayLeft=2000px";			
			contentDisplay.innerHTML = "<section class='title'><h1>欢迎使用web笔记本！</h1></section>";
			localStorage.currentDisplayCode = "<section class='title'><h1>欢迎使用web笔记本！</h1></section>"; 
		}
	}
	//阻止事件冒泡
		if(event.stopPropagation)event.stopPropagation();
		cancelBubble = true;//IE
}
//点击展示相应笔记
function showNote(event){
	if(event.target.className == "noteTitle"){
		var currentNoteName = getTargetName(event);
		localStorage.currentNoteName = currentNoteName;
		loadContentDisplay();
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