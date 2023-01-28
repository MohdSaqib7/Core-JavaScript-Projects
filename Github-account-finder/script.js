const searchInput = document.getElementById('search_input')
const searchButton = document.getElementById('search_button')
const profilesContainer = document.getElementById('profiles_container')
const clearButton = document.getElementById('clear_button');

init()

function init() {
    searchButton.addEventListener('click',getUsers)
    clearButton.addEventListener('click',clearAll)
}

async function getUsers() {
const value = searchInput.value
const streamResponse = await fetch(`https://api.github.com/search/users${value ? `?q=${value}` : ''}`)
const textResponse = await streamResponse.text()
const jsonResponse = JSON.parse(textResponse)
renderUsers(jsonResponse.items)
}

function renderUsers(userData) {
    let html = ''
    for (let i = 0; i < userData.length; i++) {
        const profilePictureUrl = userData[i]['avatar_url']
        const profileUrl = userData[i]['html_url']
        const username = userData[i]['login']
        html += `<div class="profile">
                    <img src="${profilePictureUrl}" class="profile_image" alt="profile" />
                    <div>
                        <h3 class="username">${username}</h3>
                        <a href="${profileUrl}" class="explore">visit profile</a>
                    </div>
                </div>`
    }
    profilesContainer.innerHTML = html
}

function clearAll() {
    searchInput.value = ""
    profilesContainer.innerHTML = ""
}