const buttons = document.querySelectorAll(".btns");
const display = document.querySelector(".content");
const save = document.querySelector(".save");

// for showing values of all saved objects
save.addEventListener("click", () => {
  console.log(allFields);
});

// this is the array who stores all the values of all fields as object
let allFields = [
  {
    id: 1,
    type: "input",
    label: "Input text",
    value: "text",
  },
  {
    id: 2,
    type: "textarea",
    label: "Textarea",
    value: "message",
  },
  {
    id: 3,
    type: "select",
    label: "Select Option",
    value: ["Select an option", "Option 1", "Option 2", "Option 3"],
  },
];

// for DELETE functionality
function handleClose(event) {
  const fieldId = event.target.id;
  const updatedFields = allFields.filter(
    (field) => field.id !== parseInt(fieldId),
  );
  allFields = updatedFields;

  // Remove the corresponding HTML element from the DOM
  event.target.closest(".single_content").remove();
}

// this section takes on what to add in the content area
buttons.forEach((button) => {
  button.addEventListener("click", (e) => {
    let newObj = null;

    if (e.target.parentNode.classList.contains("input")) {
      newObj = {
        id: allFields.length + 1,
        type: "input",
        label: "Input text",
        value: "text",
      };
    } else if (e.target.parentNode.classList.contains("textarea")) {
      newObj = {
        id: allFields.length + 1,
        type: "textarea",
        label: "Textarea",
        value: "message",
      };
    } else if (e.target.parentNode.classList.contains("select")) {
      newObj = {
        id: allFields.length + 1,
        type: "select",
        label: "Select Option",
        value: ["Select an option", "Option 1", "Option 2", "Option 3"],
      };
    }
    if (newObj) {
      allFields.push(newObj);
      createField(newObj.type, newObj.label, newObj.value, newObj.id);
    }
  });
});

// here i create ui for each added items
function createField(type, label, value, id) {
  const div = document.createElement("div");
  div.classList.add("single_content");
  div.setAttribute("draggable", "true"); // fordrag and drop
  div.innerHTML = `
        <div class="name_field">
            <label for="${type}">${label}</label>
            <i class="fa-solid fa-trash" id="${id}"></i>
        </div>
        <div class="input_field">
            ${
              type === "select"
                ? `<select id="${type}">
                <option value="">Select an option</option>
                <option value="1">Option 1</option>
                <option value="2">Option 2</option>
                <option value="3">Option 3</option>
            </select>`
                : type === "textarea"
                  ? `<textarea id="${type}" placeholder="${value}" ></textarea>`
                  : `<input type="${type}" id="${type}" placeholder="${value}">`
            }
        </div>
    `;

  display.appendChild(div);

  //   EventListener to store values
  const inputField = div.querySelector("input");
  const textareaField = div.querySelector("textarea");
  const selectField = div.querySelector("select");

  if (inputField) {
    inputField.addEventListener("input", () => {
      saveFieldValue(id, inputField.value);
    });
  }
  if (textareaField) {
    textareaField.addEventListener("input", () => {
      saveFieldValue(id, textareaField.value);
    });
  }
  if (selectField) {
    selectField.addEventListener("change", () => {
      saveFieldValue(id, selectField.value);
    });
  }

  // Add drag and drop event listeners to every element
  div.addEventListener("dragstart", handleDragStart);
  div.addEventListener("dragover", handleDragOver);
  div.addEventListener("dragenter", handleDragEnter);
  div.addEventListener("dragleave", handleDragLeave);
  div.addEventListener("drop", handleDrop);
  div.addEventListener("dragend", handleDragEnd);
}

// this field responsible for saving VALUES of fields in array
function saveFieldValue(id, value) {
  const fieldIndex = allFields.findIndex((field) => field.id === id);
  if (fieldIndex !== -1) {
    allFields[fieldIndex].value = value;
  }
}

// drag and drop feature of the code
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = this;
  e.dataTransfer.effectAllowed = "move";
  e.dataTransfer.setData("item", this.innerHTML);
}

function handleDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  return false;
}

function handleDragEnter(e) {
  this.classList.add("dragover");
}

function handleDragLeave(e) {
  this.classList.remove("dragover");
}

function handleDrop(e) {
  e.stopPropagation();
  if (draggedElement != this) {
    draggedElement.innerHTML = this.innerHTML;
    draggedElement.setAttribute("data-item", this.innerHTML);

    let replacedItem = e.dataTransfer.getData("item");
    this.innerHTML = replacedItem;
    this.setAttribute("data-item", replacedItem);

    // new array to check all the .single_content
    let newArray = [];
    document.querySelectorAll(".single_content").forEach((content) => {
      let id = `${content.querySelector(".name_field i").id}`;
      let type = content.querySelector(".input_field").children[0].id;
      let label =
        type === "input"
          ? "Input text"
          : type === "textarea"
            ? "Textarea"
            : "Select Option";
      let value = content.querySelector(".input_field").children[0].value;
      let obj = {
        id,
        label,
        type,
        value:
          value === ""
            ? type === "input"
              ? "text"
              : type === "textarea"
                ? "message"
                : ["Select an option", "Option 1", "Option 2", "Option 3"]
            : value,
      };

      //   to store values of fields after drag and drop
      const inputField = content.children[1].querySelector("input");
      const textareaField = content.children[1].querySelector("textarea");
      const selectField = content.children[1].querySelector("select");

      if (inputField) {
        inputField.addEventListener("input", () => {
          saveFieldValue(id, inputField.value);
        });
      }
      if (textareaField) {
        textareaField.addEventListener("input", () => {
          saveFieldValue(id, textareaField.value);
        });
      }
      if (selectField) {
        selectField.addEventListener("change", () => {
          saveFieldValue(id, selectField.value);
        });
      }

      newArray.push(obj);
    });

    allFields = newArray;
  }
  //   demonstration of how i am implementing my array of objects to store ui values and delete them directly if needed
  console.log(allFields);
}

function handleDragEnd(e) {
  this.style.opacity = "1";
  this.classList.remove("dragover");
}

// render all the objects as ui
let renderTotalList = () => {
  allFields.map((field) =>
    createField(field.type, field.label, field.value, field.id),
  );
};

renderTotalList();

// EventListener for all the delete icons
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("fa-trash")) {
    handleClose(e);
  }
});
