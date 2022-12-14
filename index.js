const button = document.querySelector('button')
const inputs = document.querySelectorAll('input')

const backendUrl = 'https://hors-pistes-backend.vercel.app' //'http://localhost:3000'

button.addEventListener('click', handleClick)

const user = {
    name: '',
    email: '',
    birth: '',
    surname: ''
}

const modelId = '1Ort_lBBBKUsWhDXxcI9RIJPnfie3_DHeEY-zT_6k_tI'

function handleClick() {
    user.name = inputs[0].value
    user.surname = inputs[1].value
    user.email = inputs[2].value
    user.birth = inputs[3].value
    if(user.name && user.email && user.birth && user.surname){
        createFolder()
    }
}

function createFolder() {
    fetch(`${backendUrl}/docs/createFolder`,{
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            inFolder: '1wZ9smE3a-J6Ns4-sOFL0FspmaPaa0AVf',
            name: user.name,
            surname: user.surname
        })
    }).then(res => res.json()).then(folder => copyModel(folder.data.id))
}

function copyModel(folderId) {
    fetch(`${backendUrl}/docs/copyModel`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            documentId: modelId,
            name: user.name,
            surname: user.surname,
            inFolder: folderId
        })
    }).then(res=>res.json()).then(data=>replace(data.id))
}

function replace(documentId) {
    fetch(`${backendUrl}/docs/replaceWords`, {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({
            documentId: documentId,
            requests: requestsWordsGenerator([
                {
                    textToReplace: '{{NAME}}',
                    newText: user.name
                },
                {
                    textToReplace: '{{SURNAME}}',
                    newText: user.surname
                },
                {
                    textToReplace: '{{BIRTH}}',
                    newText: user.birth
                },
                {
                    textToReplace: '{{EMAIL}}',
                    newText: user.email
                },
            ])
        })
    }).then(res=>res.json()).then(data=>console.log(data))
}

const requestsWordsGenerator = (arr) => {
    const res = []
    arr.map(el => res.push({
        replaceAllText: {
            containsText: {
                text: el.textToReplace,
                matchCase: true,
            },
            replaceText: el.newText,
        }
    }))
    return res
}

