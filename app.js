let section = document.querySelector('section')
let add = document.querySelector('form button')
add.addEventListener('click', e => {
	//取消form被送出的機制
	e.preventDefault()

	//抓取輸入的值
	let form = e.target.parentElement
	let todoText = form.children[0].value
	let todoMonth = form.children[1].value
	let todoDate = form.children[2].value

	if (todoText === '') {
		alert('Please add some text.')
		return
	}

	//將抓取到的值放入新建的HTML裡面
	let todoBox = document.createElement('div')
	todoBox.classList.add('todo__box')
	let text = document.createElement('p')
	text.classList.add('todo__text')
	text.innerText = todoText
	let time = document.createElement('p')
	time.classList.add('todo__time')
	time.innerText = `${todoMonth} / ${todoDate}`
	todoBox.appendChild(text)
	todoBox.appendChild(time)

	//創建完成按鈕
	let completeButton = document.createElement('button')
	completeButton.classList.add('complete')
	completeButton.innerHTML = '<i class="fa-solid fa-check"></i>'
	//完成按鈕點擊時物件會變半透明且加刪除線
	completeButton.addEventListener('click', e => {
		let finishItem = e.target.parentElement
		finishItem.classList.toggle('done')
	})

	//創建刪除按鈕
	let trashButton = document.createElement('button')
	trashButton.classList.add('trash')
	trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
	//刪除按鈕點擊時會將整個物件移除
	trashButton.addEventListener('click', e => {
		let deleteItem = e.target.parentElement
		deleteItem.addEventListener('animationend', e => { //animationend 當動畫結束時
			deleteItem.remove()
		})
		deleteItem.style.animation = 'scaleDown 0.3s forwards'
	})

	todoBox.appendChild(completeButton)
	todoBox.appendChild(trashButton)

	//創建要存入storage的物件
	let myTodo = {
		text: todoText,
		month: todoMonth,
		date: todoDate
	}

	//把每個物件放進一個array裡
	let myList = localStorage.getItem('list')
	if (myList === null) {
		localStorage.setItem('list', JSON.stringify([myTodo]))
	} else {
		let myListArray = JSON.parse(myList)
		myListArray.push(myTodo)
		localStorage.setItem('list', JSON.stringify(myListArray))
	}

	console.log(JSON.parse(localStorage.getItem('list')))

	form.children[0].value = '' //清空input的欄位
	form.children[1].value = ''
	form.children[2].value = ''
	section.appendChild(todoBox)
})

loadData()

function loadData() {
	let myList = localStorage.getItem('list')
	if (myList !== null) {
		let myListArray = JSON.parse(myList)
		myListArray.forEach(item => {

			// create a todo
			//將抓取到的值放入新建的HTML裡面
			let todoBox = document.createElement('div')
			todoBox.classList.add('todo__box')
			let text = document.createElement('p')
			text.classList.add('todo__text')
			text.innerText = item.text
			let time = document.createElement('p')
			time.classList.add('todo__time')
			time.innerText = `${item.month} / ${item.date}`
			todoBox.appendChild(text)
			todoBox.appendChild(time)

			//創建完成按鈕
			let completeButton = document.createElement('button')
			completeButton.classList.add('complete')
			completeButton.innerHTML = '<i class="fa-solid fa-check"></i>'
			//完成按鈕點擊時物件會變半透明且加刪除線
			completeButton.addEventListener('click', e => {
				let finishItem = e.target.parentElement
				finishItem.classList.toggle('done')
			})

			//創建刪除按鈕
			let trashButton = document.createElement('button')
			trashButton.classList.add('trash')
			trashButton.innerHTML = '<i class="fa-solid fa-trash-can"></i>'
			//刪除按鈕點擊時會將整個物件移除
			trashButton.addEventListener('click', e => {
				let deleteItem = e.target.parentElement
				deleteItem.addEventListener('animationend', e => { //animationend 當動畫結束時
					//remove from storage
					let text = deleteItem.children[0].innerText
					let myListArray = JSON.parse(localStorage.getItem("list"))
					myListArray.forEach((item, index) => {
					if (item.text == text) {
						myListArray.splice(index, 1);
						localStorage.setItem("list", JSON.stringify(myListArray));
						}
					})
					deleteItem.remove()
				})
				deleteItem.style.animation = 'scaleDown 0.3s forwards'
			})

			todoBox.appendChild(completeButton)
			todoBox.appendChild(trashButton)

			section.appendChild(todoBox)

		})
	}
}

function mergeTime(arr1, arr2) {
  let result = [];
  let i = 0;
  let j = 0;

  while (i < arr1.length && j < arr2.length) {
    if (Number(arr1[i].month) > Number(arr2[j].month)) {
      result.push(arr2[j]);
      j++;
    } else if (Number(arr1[i].month) < Number(arr2[j].month)) {
      result.push(arr1[i]);
      i++;
    } else if (Number(arr1[i].month) == Number(arr2[j].month)) {
      if (Number(arr1[i].date) > Number(arr2[j].date)) {
        result.push(arr2[j]);
        j++;
      } else {
        result.push(arr1[i]);
        i++;
      }
    }
  }

  while (i < arr1.length) {
    result.push(arr1[i]);
    i++;
  }
  while (j < arr2.length) {
    result.push(arr2[j]);
    j++;
  }

  return result;
}

function mergeSort(arr) {
  if (arr.length === 1) {
    return arr;
  } else {
    let middle = Math.floor(arr.length / 2);
    let right = arr.slice(0, middle);
    let left = arr.slice(middle, arr.length);
    return mergeTime(mergeSort(right), mergeSort(left));
  }
}

let sortButton = document.querySelector("div.sort button");
sortButton.addEventListener("click", () => {
  // sort data
  let sortedArray = mergeSort(JSON.parse(localStorage.getItem("list")));
  localStorage.setItem("list", JSON.stringify(sortedArray));

  // remove data
  let len = section.children.length;
  for (let i = 0; i < len; i++) {
    section.children[0].remove();
  }

  // load data
  loadData();
})