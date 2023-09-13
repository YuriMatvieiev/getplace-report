const HOST = "https://app.getplace.io";
let selectedPlan = 0;

//const HOST = "http://localhost:46000";
mapboxgl.accessToken =
  "pk.eyJ1Ijoic3Nlcmd5IiwiYSI6ImNsOHU5enNjbTAyMGQzcHJ4ODlsanNpNHgifQ.NXh_OvvnBFO_uArBg676IA";

const planFullSub = 1;
const planUnlimitedReports = 2;

function ValidateEmail(value) {
  const email_filter =
    /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;
  return email_filter.test(value);
}

const initSection = function (sectionId, buttonClass, plan) {
  let section = document.getElementById(sectionId);
  let body = document.getElementsByTagName("body")[0];
  let buttons = document.getElementsByClassName(buttonClass);

  if (!section || !buttons) {
    return;
  }

  let backButtons = section.getElementsByClassName("confirm__form-back-button");
  const urlParams = new URLSearchParams(window.location.search);
  const locationInput = urlParams.get("address");
  const locationAddress = document.getElementById("locationAddress");
  const locationAddressWrap = document.getElementById("locationAddressWrap");
  const geocoderForm = document.getElementById("geocoder-form");
  const locationAddressTitle = document.getElementById("locationAddressTitle");

  // Добавьте обработчик события клика на locationAddress
  locationAddressWrap.addEventListener("click", () => {
    locationAddressWrap.style.display = "none";
    locationAddressTitle.style.display = "none";
    geocoderForm.style.display = "block";
  });

  if (locationInput) {
    locationAddress.textContent = locationInput;
  }
  for (let b of backButtons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      body.style.overflowY = "scroll";
      section.style.display = "none";
      geocoderForm.style.display = "block";
      locationAddressWrap.style.display = "none";
      locationAddressTitle.style.display = "none";
    });
  }

  for (let b of buttons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      selectedPlan = plan;
      body.style.overflowY = "hidden";
      section.style.display = "block";
    });
  }

  let confirmButtons = section.getElementsByClassName("confirm__form-button");
  let sErrs = new Errors(
    [sectionId + "-name", sectionId + "-email", sectionId + "-password"],
    sectionId + "-errs"
  );

  for (let b of confirmButtons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      sErrs.Clear();
      sErrs.HideError();

      let full_name = document.getElementById(sectionId + "-name");
      let company = "company";
      let password = document.getElementById(sectionId + "-password");
      let email = document.getElementById(sectionId + "-email");

      let errors = [];
      if (!full_name || full_name.value.length < 2) {
        errors.push(full_name ? full_name.getAttribute("id") : null);
      }
      if (!password || password.value.length < 6) {
        errors.push(password ? password.getAttribute("id") : null);
      }
      if (!email || !ValidateEmail(email.value)) {
        errors.push(email ? email.getAttribute("id") : null);
      }

      if (errors.length === 0) {
        let data = {
          name: full_name.value,
          company: company.value,
          password: password.value,
          email: email.value,
          payment_opt: selectedPlan * 1,
        };

        let xhttp = new XMLHttpRequest();

        xhttp.onreadystatechange = () => {
          if (xhttp.readyState === 4) {
            if (xhttp.status === 200) {
              try {
                let resp = JSON.parse(xhttp.response);
                if (resp?.status === "ok") {
                  console.log(JSON.stringify(resp));
                  if (selectedPlan === 0) {
                    // heatmap
                    window.location.href =
                      "https://buy.stripe.com/6oE8yp7c53Nd0ZWbIR?client_reference_id=" +
                      resp.payment_ses;
                  } else if (selectedPlan === planFullSub) {
                    // heatmap + reports
                    window.location.href =
                      "https://buy.stripe.com/9AQ3e5fIBbfF4c828u?client_reference_id=" +
                      resp.payment_ses;
                  } else if (selectedPlan === planUnlimitedReports) {
                    window.location.href =
                      "https://buy.stripe.com/00g15X53X1F59ws5kH?client_reference_id=" +
                      resp.payment_ses;
                  }
                  // https://app.getplace.io/login/stripe?sess={CHECKOUT_SESSION_ID}
                } else {
                  let msg = "Unexpected error";
                  if (resp?.errors.indexOf("used:email") >= 0) {
                    msg = "Email already in use";
                    sErrs.Highlight([email.getAttribute("id")]);
                  }

                  sErrs.ShowError(msg);
                }
              } catch (e) {}
            } else {
              sErrs.ShowError("Unexpected error");
            }
          }
        };

        xhttp.open("POST", HOST + "/auth/register", true);
        xhttp.send(JSON.stringify(data));
      } else {
        sErrs.Highlight(errors);
      }
    });
  }
};

var Errors = function (ids, errContainer = "") {
  this.ids = ids;
  this.ErrContainer = document.getElementById(errContainer);

  this.Init = function () {
    for (let i of this.ids) {
      if (document.getElementById(i)) {
        document.getElementById(i).addEventListener("focus", function (e) {
          e.target.classList.remove("error");
        });
      }
    }
  };

  this.Init();

  this.ShowError = function (msg) {
    this.ErrContainer.innerText = msg;
    this.ErrContainer.style.display = "block";
  };
  this.HideError = function () {
    if (!!this?.ErrContainer) {
      this.ErrContainer.style.display = "none";
    }
  };
  this.Highlight = function (ids) {
    for (let i of ids) {
      let element = document.getElementById(i);
      if (element) {
        element.classList.add("error");
      }
    }
  };

  this.Clear = function () {
    for (let i of this.ids) {
      let element = document.getElementById(i);
      if (element) {
        element.classList.remove("error");
      }
    }
  };

  this.ShowSnack = function (msg) {
    SnackBar({ message: msg, icon: "danger", status: "red" });
  };
};

function InitGeocoder(ID) {
  this.initData = function () {
    return {
      address: "",
      full_name: "",
      company_name: "",
      email: "",
      latitude: 0,
      longitude: 0,
      postcode: "",
      hex: "",
    };
  };
  this.data = this.initData();
  this.geocoder = new MapboxGeocoder({
    accessToken: mapboxgl.accessToken,
    bbox: [
      -8.585350424507451, 49.89060631678373, 1.762474098318385,
      60.85571099962073,
    ],
    language: "en-GB",
    placeholder: "Type any UK address or postcode",
  });

  this.geocoder.addTo("#" + ID);

  this.geocoder.on("clear", () => {
    this.data = this.initData();
  });

  this.geocoder.on("result", (e) => {
    this.data.postcode = "";
    for (let item of e.result.context) {
      if (item.id.includes("postcode")) {
        this.data.postcode = item.text;
        break;
      }
    }

    if (this.data.postcode === "" && e.result.id.includes("postcode")) {
      this.data.postcode = e.result.text;
    }

    this.data.latitude = e.result.center[1];
    this.data.longitude = e.result.center[0];

    this.data.hex = h3.latLngToCell(
      this.data.latitude,
      this.data.longitude,
      10
    );

    this.data.address = e.result.place_name;
  });
}

function InitGeoForm(geocoderId, geocoderSectionId) {
  let section = document.getElementById(geocoderSectionId);
  let body = document.getElementsByTagName("body")[0];

  document.getElementById("geocoder-form").style.display = "block"; // Показать geocoder-form при нажатии кнопки "Back"
  document.getElementById("locationAddressWrap").style.display = "none"; // Спрятать locationAddress при нажатии кнопки "Back"
  document.getElementById("locationAddressTitle").style.display = "none";
  if (!section || !document.getElementById(geocoderId)) {
    return;
  }

  let backButtons = section.getElementsByClassName("confirm__form-back-button");

  for (let b of backButtons) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      body.style.overflowY = "scroll";
      section.style.display = "none";
    });
  }

  let geocoder = new InitGeocoder(geocoderId);

  let geoErrs = new Errors([geocoderId], "");

  let geoB = document.getElementById(geocoderId + "-b");

  geoB.addEventListener("click", (e) => {
    e.preventDefault();

    if (
      geocoder.data.latitude === 0 ||
      geocoder.data.longitude === 0 ||
      geocoder.data.hex === "" ||
      geocoder.data.address === "" ||
      geocoder.data.postcode === ""
    ) {
      geoErrs.Highlight([geocoderId]);
      document.getElementById(geocoderId + "-error").innerText =
        "Please input a UK address or postcode and choose one from the list.";
    } else {
      document.getElementById(geocoderId + "-error").innerText = "";
      geoErrs.Clear();
      document.getElementById("locationAddress").innerText =
        geocoder.data.address;
      document.getElementById("geocoderData").value = JSON.stringify(
        geocoder.data
      );

      body.style.overflowY = "hidden";
      section.style.display = "block";

      document.getElementById("geocoder-form").style.display = "none";
      document.getElementById("locationAddressWrap").style.display = "block";
      document.getElementById("locationAddressTitle").style.display = "block";
    }
  });
}

//sections
initSection("full-sub-section", "full-sub-b", planFullSub);
initSection(
  "unlimited-reports-section",
  "unlimited-reports-b",
  planUnlimitedReports
);
initSection("report-on-demand-section", "geocoder3");
initSection("report-on-demand-section", "geocoder4");
initSection("report-on-demand-section", "geocoder5");
InitGeoForm("geocoder1", "report-on-demand-section");
InitGeoForm("geocoder2", "report-on-demand-section");
InitGeoForm("geocoder3", "report-on-demand-section");

let geocoderForm = document.getElementById("report-on-demand-section");
if (!!geocoderForm) {
  let formB = geocoderForm.getElementsByClassName("confirm__form-button");
  let formBErrs = new Errors([
    "report-on-demand-section-email",
    "report-on-demand-section-name",
  ]);

  for (let b of formB) {
    b.addEventListener("click", (e) => {
      e.preventDefault();

      let email = document.getElementById("report-on-demand-section-email");
      let name = document.getElementById("report-on-demand-section-name");
      let geocoderDataElement = document.getElementById("geocoderData");
      let errors = [];

      if (!ValidateEmail(email.value)) {
        errors.push(email.getAttribute("id"));
      }

      if (!name.value || name.value.length < 2) {
        errors.push(name.getAttribute("id"));
      }

      if (geocoderDataElement) {
        let geocoderData = geocoderDataElement.value;

        if (geocoderData) {
          try {
            let data = JSON.parse(geocoderData);
            data.full_name = name.value;
            data.email = email.value;
            data.company_name = "company";

            let xhttp = new XMLHttpRequest();

            xhttp.onreadystatechange = () => {
              if (xhttp.readyState === 4) {
                try {
                  let resp = JSON.parse(xhttp.response);
                  if (resp?.status === "ok") {
                    window.location.href =
                      "https://buy.stripe.com/cN2bKBcwpabBgYUcN7?client_reference_id=" +
                      resp.id;
                  }
                } catch (e) {}
              }
            };

            xhttp.open("POST", HOST + "/report-order", true);
            xhttp.send(JSON.stringify(data));
          } catch (e) {
            console.error("Invalid JSON data:", e);
          }
        } else {
          console.error("Empty JSON data");
        }
      } else {
        console.error("geocoderData element not found");
      }

      if (errors.length > 0) {
        formBErrs.Highlight(errors);
      }
    });
  }
}
