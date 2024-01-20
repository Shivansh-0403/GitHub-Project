document.getElementById("userForm").addEventListener("submit", async function (event) {
    event.preventDefault();
    const username = document.getElementById("inputData").value;

    try {
        // Make a POST request to your backend
        const response = await fetch("/api/endpoint", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ inputData: username }),
        });

        // Check if the response status is OK (200)
        if (response.ok) {
            const data = await response.json();

            // Display user data
            document.getElementById("userDataContainer").innerHTML = `
                <div class="card bg-dark text-white text-center">
                    <h3>User GitHub Info</h3>
                    <img src="${data.user.avatar_url}" class="d-none d-sm-block mx-auto mb-3" alt="User Image" height="200" width="200">
                    <div class="card-body">
                        <h4 class="card-title">${data.user.name}</h4>
                        <p class="card-text">${data.user.bio}</p>
                        <a href="${data.user.html_url}" class="btn btn-primary">GitHub Profile</a>
                    </div>
                </div>
            `;

            function paginate(items, itemsPerPage, paginationContainer) {
                let currentPage = 1;
                const totalPages = Math.ceil(items.length / itemsPerPage);

                function showItems(page) {
                    const startIndex = (page - 1) * itemsPerPage;
                    const endIndex = startIndex + itemsPerPage;
                    const pageItems = items.slice(startIndex, endIndex);

                    const itemsContainer = document.querySelector("#items");
                    itemsContainer.innerHTML = "";

                    const heading = document.createElement("h3")
                    heading.textContent = "Repositories"
                    itemsContainer.appendChild(heading)
                    heading.classList.add("repo-heading")

                    const repoInfo = document.createElement("div")
                    repoInfo.classList.add("repos-grid")

                    pageItems.forEach((item) => {
                        const mainDiv = document.createElement("div")
                        mainDiv.classList.add("card")
                        mainDiv.classList.add("text-center")
                        mainDiv.classList.add("bg-dark")
                        mainDiv.classList.add("text-white")
                        mainDiv.classList.add("repo")

                        const headerDiv = document.createElement("div")
                        headerDiv.classList.add("card-header")
                        headerDiv.classList.add("bg-secondary")
                        headerDiv.innerHTML = item.name

                        const bodyDiv = document.createElement("div");
                        bodyDiv.classList.add("card-body")

                        const descriptionPara = document.createElement("p")
                        descriptionPara.classList.add("card-text")
                        if (item.description === null){
                            descriptionPara.innerText = "No Description Provided."
                        }
                        else {
                            descriptionPara.innerHTML = item.description
                        }

                        const anchorURL = document.createElement("a")
                        anchorURL.classList.add("card-link")
                        anchorURL.href = "https://github.com/" + item.html_url;
                        anchorURL.innerText = "GitHub Repository Link"

                        const langButton = document.createElement("button")
                        langButton.classList.add("btn", "btn-primary", "langBtn")
                        langButton.innerText = item.language
                        langButton.disabled = true

                        bodyDiv.appendChild(descriptionPara)
                        bodyDiv.appendChild(anchorURL)
                        bodyDiv.appendChild(document.createElement("br"))
                        bodyDiv.appendChild(document.createElement("br"))
                        bodyDiv.appendChild(langButton)

                        mainDiv.appendChild(headerDiv)
                        mainDiv.appendChild(bodyDiv)

                        repoInfo.appendChild(mainDiv)
                    });
                    itemsContainer.appendChild(repoInfo)
                }

                function setupPagination() {
                    const pagination = document.querySelector(paginationContainer);
                    pagination.innerHTML = "";
                    const unorderedList = document.createElement("ul");
                    unorderedList.classList.add("pagination");
                    unorderedList.classList.add("justify-content-center");
                    for (let i = 1; i <= totalPages; i++) {
                        const listItem = document.createElement("li");
                        listItem.classList.add("page-item");

                        const link = document.createElement("a");
                        link.href = "#";
                        link.innerText = i;

                        link.classList.add("page-link");

                        link.addEventListener("click", (event) => {
                            event.preventDefault();
                            currentPage = i;
                            showItems(currentPage);

                        });
                        listItem.appendChild(link);

                        unorderedList.appendChild(listItem);
                    }
                    pagination.appendChild(unorderedList)

                }
                showItems(currentPage);
                setupPagination();
            }

            const itemsPerPage = 10;
            const paginationContainer = "#pagination";

            paginate(data.repos, itemsPerPage, paginationContainer);
        } else {
            // Handle non-OK response (e.g., 404)
            console.error("Error making API call:", response.statusText);
        }
    } catch (error) {
        console.error("Error making API call:", error);
    }
});


