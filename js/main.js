// Element selection
const sectionArea = document.querySelector("section");
const searchInp = document.querySelector(".search input");
const searchBtn = document.querySelector(".search i");

// Function to fetch meals based on the provided meal name
const getMealsBySearch = async (mealName) => {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/search.php?s=${mealName}`
  );

  let meal = await response.json();
  generateMealContainers(meal);
  searchInp.value = "";
};

// Function to generate meal containers based on the provided meal data
const generateMealContainers = (meal) => {
  let mealsArr = meal.meals;

  let preWrongText = document.querySelector(".wrong-text");
  if (preWrongText) preWrongText.remove();

  document.querySelector("section .container").innerHTML = "";

  sectionArea.classList.remove("hero-section");
  sectionArea.classList.add("search-results");

  if (!mealsArr) {
    let wrongText = document.createElement("p");
    wrongText.className = "wrong-text";
    wrongText.append("Sorry but we don't have any recipe with this name");
    sectionArea.querySelector(".container").appendChild(wrongText);
    return;
  }

  mealsArr.forEach((meal) => {
    let mealById = meal.idMeal;

    const mealContainers = async () => {
      let response = await fetch(
        `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${meal.idMeal}`
      );
      response = await response.json();

      meal = response.meals[0];

      let container = document.createElement("div");
      container.className = "box";

      let image = document.createElement("div");
      image.className = "image";
      container.appendChild(image);

      let img = document.createElement("img");
      img.src = meal.strMealThumb;
      img.loading = "lazy";
      image.appendChild(img);

      let text = document.createElement("div");
      text.className = "text";
      container.appendChild(text);

      let title = document.createElement("h3");
      title.append(meal.strMeal);
      text.appendChild(title);

      let area = document.createElement("div");
      area.className = "area";
      text.appendChild(area);

      let areaIcon = document.createElement("i");
      areaIcon.classList.add("fa-solid", "fa-earth");
      area.appendChild(areaIcon);

      let areaName = document.createElement("span");
      areaName.append(meal.strArea);
      area.appendChild(areaName);

      let category = document.createElement("div");
      category.className = "category";
      text.appendChild(category);

      let categoryIcon = document.createElement("i");
      categoryIcon.classList.add("fa-solid", "fa-utensils");
      category.appendChild(categoryIcon);

      let categoryName = document.createElement("span");
      categoryName.append(meal.strCategory);
      category.appendChild(categoryName);

      let showBtn = document.createElement("button");
      showBtn.className = "show-btn";
      showBtn.append("Show");
      text.appendChild(showBtn);

      sectionArea.querySelector(".container").appendChild(container);

      showBtn.addEventListener("click", () => {
        getfullMealDetails(meal.idMeal);
        console.log(meal.idMeal);
      });
    };
    mealContainers();
  });
};

// Function to fill the meal data on the meal details page
const fillMealData = () => {
  let mealDetails = JSON.parse(sessionStorage.getItem("meal"));
  let image = document.querySelector(".meal-details .image");
  let title = document.querySelector(".meal-details h2");
  let area = document.querySelector(".meal-details .area span");
  let category = document.querySelector(".meal-details .category span");
  let tags = document.querySelector(".meal-details .tags");
  let ingBtn = document.querySelector(".meal-details .ing");
  let insBtn = document.querySelector(".meal-details .ins");
  let ingArea = document.querySelector(".meal-details .ingr");
  let insArea = document.querySelector(".meal-details .inst");
  let youtubeLink = document.querySelector(".youtube-link");
  let backBtn = document.querySelector(".meal-details .back");

  if (title) {
    image.style.backgroundImage = `url(${mealDetails.strMealThumb})`;

    title.append(mealDetails.strMeal);

    area.append(mealDetails.strArea);

    category.append(mealDetails.strCategory);

    let tagsArr = mealDetails.strTags;
    if (tagsArr) {
      tagsArr = tagsArr.split(",");
      if (tagsArr.length > 4) {
        tagsArr.length = 4;
      }

      for (let i = 0; i < tagsArr.length; i++) {
        let span = document.createElement("span");
        span.append(tagsArr[i]);
        tags.appendChild(span);
      }
    }

    let index = 1;
    while (
      mealDetails[`strIngredient${index}`] != "" &&
      mealDetails[`strIngredient${index}`] != null
    ) {
      // Create li elements for ingredients and append them to the ingredients area
      let li = document.createElement("li");
      let measure = mealDetails[`strMeasure${index}`];
      let ingredient = mealDetails[`strIngredient${index}`];
      li.append(`${measure} ${ingredient}`);
      ingArea.appendChild(li);
      index++;
    }

    insArea.append(mealDetails.strInstructions);

    // Add event listeners to ingredient and instruction buttons
    insBtn.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      insBtn.classList.add("active");
      ingArea.style.display = "none";
      insArea.style.display = "block";
    });
    ingBtn.addEventListener("click", () => {
      document.querySelector(".active").classList.remove("active");
      ingBtn.classList.add("active");
      insArea.style.display = "none";
      ingArea.style.display = "grid";
    });

    backBtn.addEventListener("click", () => {
      window.history.back();
    });

    youtubeLink.href = mealDetails.strYoutube;
  }
};

// Function to fetch the full meal details based on the provided meal ID
const getfullMealDetails = async (mealId) => {
  let response = await fetch(
    `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`
  );

  let mealDetails = await response.json();
  mealDetails = mealDetails.meals[0];

  sessionStorage.setItem("meal", JSON.stringify(mealDetails));

  window.location.href = "mealDetails.html";
};

if (searchBtn) {
  searchBtn.addEventListener("click", () => getMealsBySearch(searchInp.value));
  searchInp.addEventListener("keydown", (e) => {
    if (e.keyCode == 13) getMealsBySearch(searchInp.value);
  });
}

fillMealData();

if (document.querySelector(".home-btn")) {
  //go back to Home section
  let homeBtn = document.querySelector(".home-btn");

  homeBtn.addEventListener("click", () => window.location.reload());

  // Areas Section
  let areasBtn = document.querySelector(".areas-btn");

  const countryFlag = async (countryName, nationality) => {
    let response = await fetch(
      `https://restcountries.com/v3.1/name/${countryName}`
    );

    let obj = await response.json();

    let flag = obj[0].flags.png;

    // Create country HTML Structure

    let country = document.createElement("div");
    country.className = "country";

    let image = document.createElement("div");
    image.className = "image";
    country.appendChild(image);

    let img = document.createElement("img");
    img.src = flag;
    image.appendChild(img);

    let title = document.createElement("h3");
    title.className = "title";
    title.append(nationality);
    country.appendChild(title);

    document.querySelector(".areas-section .container").appendChild(country);
  };

  const nationalityToCountry = {
    American: "United States",
    British: "United Kingdom",
    Canadian: "Canada",
    Chinese: "China",
    Croatian: "Croatia",
    Dutch: "Netherlands",
    Egyptian: "Egypt",
    Filipino: "Philippines",
    French: "France",
    Greek: "Greece",
    Indian: "India",
    Irish: "Ireland",
    Italian: "Italy",
    Jamaican: "Jamaica",
    Japanese: "Japan",
    Kenyan: "Kenya",
    Malaysian: "Malaysia",
    Mexican: "Mexico",
    Moroccan: "Morocco",
    Polish: "Poland",
    Portuguese: "Portugal",
    Russian: "Russia",
    Spanish: "Spain",
    Thai: "Thailand",
    Tunisian: "Tunisia",
    Turkish: "Turkey",
    Unknown: "Unknown",
    Vietnamese: "Vietnam",
  };

  const recipesCountries = async () => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?a=list`
    );

    let countries = await response.json();

    countries.meals.forEach((e) => {
      let nationality = e.strArea;
      if (nationality != "Unknown") {
        countryFlag(nationalityToCountry[nationality], nationality);
      }
    });
  };

  areasBtn.addEventListener("click", () => {
    document.querySelector("section .container").innerHTML = "";
    sectionArea.className = "areas-section";
    document.querySelector(".bottom-bar .active").classList.remove("active");
    document.querySelector(".bottom-bar .areas-btn").classList.add("active");

    recipesCountries();
  });

  sectionArea.addEventListener("click", (e) => {
    let el = e.target.parentElement;
    if (el.className == "country") {
      areasFetch(e.target.textContent);
    } else if (el.parentElement.className == "country") {
      areasFetch(el.parentElement.querySelector("h3").textContent);
    }
  });

  // Fetch meals by area
  const areasFetch = async (area) => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`
    );

    response = await response.json();

    generateMealContainers(response);
  };

  /* Categories Section */
  // fetch categories
  const categoriesFetch = async () => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?c=list`
    );
    response = await response.json();

    generateCategoriesContainer(response);
  };

  const generateCategoriesContainer = (categories) => {
    let categoriesArr = categories.meals;
    categoriesArr.forEach((e) => {
      if (e.strCategory != "Pork") {
        let category = document.createElement("div");
        category.className = "category";

        let image = document.createElement("div");
        image.className = "image";
        category.appendChild(image);

        let img = document.createElement("img");
        img.src = `media/${e.strCategory}.png`;
        img.loading = "lazy";
        image.appendChild(img);

        let title = document.createElement("h3");
        title.append(e.strCategory);
        category.appendChild(title);

        sectionArea.querySelector(".container").appendChild(category);
      }
    });
  };

  const categoryBtn = document.querySelector(".categories-btn");

  categoryBtn.addEventListener("click", () => {
    document.querySelector("section .container").innerHTML = "";
    sectionArea.className = "category-section";
    document.querySelector(".bottom-bar .active").classList.remove("active");
    categoryBtn.classList.add("active");

    categoriesFetch();
  });

  sectionArea.addEventListener("click", (e) => {
    let el = e.target.parentElement;
    if (el.className == "category") {
      categoryFetch(e.target.textContent);
    } else if (el.parentElement.className == "category") {
      categoryFetch(el.parentElement.querySelector("h3").textContent);
    }
  });

  // Fetch meals by category
  const categoryFetch = async (category) => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`
    );

    response = await response.json();

    generateMealContainers(response);
  };

  // Ingredients section
  const ingredientsFetch = async () => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/list.php?i=list`
    );
    response = await response.json();

    console.log(response);

    generateIngredientsContainer(response);
  };

  const generateIngredientsContainer = (ingredients) => {
    let ingredientsArr = ingredients.meals;

    ingredientsArr.forEach((e) => {
      if (e.strIngredient != "Pork") {
        let ingredient = document.createElement("div");
        ingredient.className = "ingredient";

        let title = document.createElement("h3");
        title.append(e.strIngredient);
        ingredient.appendChild(title);

        if (e.strDescription != null) {
          let description = document.createElement("p");
          description.append(e.strDescription);
          ingredient.appendChild(description);
        }

        sectionArea.querySelector(".container").appendChild(ingredient);
      }
    });
  };

  const ingredientsBtn = document.querySelector(".ingredients-btn");

  ingredientsBtn.addEventListener("click", () => {
    document.querySelector("section .container").innerHTML = "";
    sectionArea.className = "ingredients-section";
    document.querySelector(".bottom-bar .active").classList.remove("active");
    ingredientsBtn.classList.add("active");

    ingredientsFetch();
  });

  sectionArea.addEventListener("click", (e) => {
    let el = e.target.parentElement;
    if (el.className == "ingredient") {
      ingredientFetch(el.querySelector("h3").textContent);
    }
  });

  // Fetch meals by category
  const ingredientFetch = async (ingredient) => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/filter.php?i=${ingredient}`
    );

    response = await response.json();

    generateMealContainers(response);
  };

  // Random section

  const randomFetch = async () => {
    let response = await fetch(
      `https://www.themealdb.com/api/json/v1/1/random.php`
    );
    response = await response.json();

    getfullMealDetails(response.meals[0].idMeal);
  };

  const randomBtn = document.querySelector(".random-btn");

  randomBtn.addEventListener("click", () => {
    document.querySelector(".bottom-bar .active").classList.remove("active");
    randomBtn.classList.add("active");

    randomFetch();
  });
}
