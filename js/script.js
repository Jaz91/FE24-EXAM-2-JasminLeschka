let items = null;

const flags = {
  "Austria": "https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/austria-flag-icon.png",
  "Peru": "https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/peru-national-flag-icon.png",
  "Italy": "https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/italy-flag-icon.png",
  "Chile" : "https://uxwing.com/wp-content/themes/uxwing/download/flags-landmarks/chile-flag-icon.png"
}

async function loadItems() {
  items = await fetch("/data/Items.json")
    .then((response) => response.json())
    .catch((error) => console.log("There is an " + error));
}

function displayData() {
  // Add cards
  const containerElement = document.getElementById("MainContent");
  containerElement.innerHTML = "";
  for (const item of items) {
    const itemHtml = `
                  <div class="card shadow" style="width: 18rem;">
                    <div class="card-header d-flex justify-content-between align-items-center" >
                        <span class="Item">Item</span>
                        <p class="vegan" ${(item.Vegan) ? "" : 'style="display: none"'}> vegan<img src="icons/leaf.png"  alt="vegan icon" class="ms-auto" width="20px" height="20px"></p>
                    </div>
                    <br>
                    <img src="${item.Image}"
                        class="card-img-top" alt="${item.Item} product image">
                    <div class="card-body">
                        <hr>
                        <h5 class="card-title">${item.Item}</h5>
                        <p class="card-text"><img src="icons/priority.png" alt="priority icon" width="18px" height="18px"> priority level: 
                            <span class="p-2 ImportanceValue">${item.Importance}</span></p>
                        <p>From: ${item.Provenance} <img src="${flags[item.Provenance]}" width="15px" height="15px"></p>
                        <P>${item.Description}</P>
                        <hr>
                        <div class="d-grid gap-2 d-md-flex justify-content-md-end">
                            <button type="button" class="btn btn-danger btn-sm me-md-2 ResetButton"><img class="reset"
                                    src="icons/reset.png" alt="reset icon"> Reset</button>
                            <button type="button" class="btn btn-success btn-sm ImportantButton"> <img class="important"
                                    src="icons/important.png" alt="important icon"> Important</button>
                        </div>
                    </div>
                </div>`;
    containerElement.innerHTML += itemHtml;
    colorByImportance(containerElement.lastChild.querySelectorAll(".ImportanceValue")[0], item.Importance);
  }

  // Add button events
  let importanButtons = document.querySelectorAll(".ImportantButton");
  importanButtons.forEach((element, i) => {
    element.addEventListener("click", () => {
      if (items[i].Importance < 5)
        items[i].Importance++;
      const currentElement = document.querySelectorAll(".ImportanceValue")[i];
      currentElement.innerHTML = items[i].Importance;
      colorByImportance(currentElement, items[i].Importance);
    });
  });

  // reset Button
  let resetButtons = document.querySelectorAll(".ResetButton");
  resetButtons.forEach((element, i) => {
    element.addEventListener("click", () => {
      items[i].Importance = 0;
      const currentElement = document.querySelectorAll(".ImportanceValue")[i];
      currentElement.innerHTML = items[i].Importance;
      colorByImportance(currentElement, items[i].Importance);
    });
  });
}

function colorByImportance(currentElement, importance) {
  if (importance < 2) {
    currentElement.style.background = "green";
  }
  else if (importance < 4) {
    currentElement.style.background = "yellow";
  }
  else {
    currentElement.style.background = "red"
  }
}


document.getElementById("sort").addEventListener("click", () => {
  // Sort most important items first
  let sortedArray = items.sort((a, b) => b.Importance - a.Importance);
  items = sortedArray;
  displayData();
});

document.addEventListener('DOMContentLoaded', async function () {
  await loadItems();
  displayData();
});


