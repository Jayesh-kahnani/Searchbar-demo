import React, { useState, useEffect, useRef } from "react";

const SearchResults = ({ results }) => {
  const [selectedForms, setSelectedForms] = useState({});
  const [selectedStrengths, setSelectedStrengths] = useState({});
  const [selectedPackagings, setSelectedPackagings] = useState({});
  const [lowestSellingPrices, setLowestSellingPrices] = useState({});
  const resultBoxRef = useRef(null);

  useEffect(() => {
    if (results && results.data && results.data.saltSuggestions) {
      const saltSuggestions = results.data.saltSuggestions;
      const initialSelectedForms = {};
      const initialSelectedStrengths = {};
      const initialSelectedPackagings = {};

      saltSuggestions.forEach((salt, id) => {
        const firstForm = Object.keys(salt.salt_forms_json)[0];
        const firstStrength = Object.keys(salt.salt_forms_json[firstForm])[0];
        const firstPackaging = Object.keys(
          salt.salt_forms_json[firstForm][firstStrength]
        )[0];

        initialSelectedForms[id] = firstForm;
        initialSelectedStrengths[id] = firstStrength;
        initialSelectedPackagings[id] = firstPackaging;
      });

      setSelectedForms(initialSelectedForms);
      setSelectedStrengths(initialSelectedStrengths);
      setSelectedPackagings(initialSelectedPackagings);

      const lowestPrices = {};
      saltSuggestions.forEach((salt, id) => {
        let lowestPrice = null;
        Object.values(salt.salt_forms_json).forEach((forms) => {
          Object.values(forms).forEach((strengths) => {
            Object.values(strengths).forEach((packaging) => {
              if (!lowestPrice || packaging.price < lowestPrice) {
                lowestPrice = packaging.price;
              }
            });
          });
        });
        lowestPrices[id] = lowestPrice;
      });
      setLowestSellingPrices(lowestPrices);
    }
  }, [results]);

  const toggleShowMoreForms = () => {
    setShowMoreForms((prev) => !prev);
  };

  const toggleShowMoreStrengths = () => {
    setShowMoreStrengths((prev) => !prev);
  };

  const toggleShowMorePackagings = () => {
    setShowMorePackagings((prev) => !prev);
  };

  const [showMoreForms, setShowMoreForms] = useState(false);
  const [showMoreStrengths, setShowMoreStrengths] = useState(false);
  const [showMorePackagings, setShowMorePackagings] = useState(false);


  if (!results || !results.data || !results.data.saltSuggestions) {
    return (
      <div className="discounts">
        “ Find medicines with amazing discount “
      </div>
    );
  } else if (results.data.saltSuggestions.length === 0) {
    return <div >No results</div>;
  }

  const saltSuggestions = results.data.saltSuggestions;

  return (
    <div className="parent">
      {saltSuggestions.map((salt, id) => (
        <div className="flex result-box" key={id} ref={resultBoxRef}>
          <div className="flex left-box flex-col ">
            <div className="row-1-form flex">
              <div className="form-text">Form:</div>
              <div className="button-box" style={{ left: "11.5%" }}>
                {Object.keys(salt.salt_forms_json).map((form, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setSelectedForms((prevForms) => ({
                        ...prevForms,
                        [id]: form,
                      }));
                      setSelectedStrengths((prevStrengths) => ({
                        ...prevStrengths,
                        [id]: null, // Reset selected strength on form change
                      }));
                      setSelectedPackagings((prevPackagings) => ({
                        ...prevPackagings,
                        [id]: null, // Reset selected packaging on form change
                      }));
                    }}
                    className={`buttons
                      ${
                        selectedForms[id] === form && lowestSellingPrices[id]
                          ? "selected"
                          : ""
                      }
                      ${
                        selectedForms[id] === form && !lowestSellingPrices[id]
                          ? "not-av-selected"
                          : ""
                      }
                      ${
                        selectedForms[id] !== form && lowestSellingPrices[id]
                          ? "not-selected"
                          : ""
                      }
                      ${
                        selectedForms[id] !== form && !lowestSellingPrices[id]
                          ? "not-av-not-selected"
                          : ""
                      }
                      ${index > 3 && !showMoreForms ? "hidden" : ""}
                    `}
                  >
                    {form}
                  </button>
                ))}
                {Object.keys(salt.salt_forms_json).length > 4 && (
                  <button
                    onClick={() => toggleShowMoreForms(id)}
                    className="more"
                  >
                    {showMoreForms[id] ? "Less" : "More"}
                  </button>
                )}
              </div>
            </div>
            <div className="row-2-strength flex ">
              <div className="form-text">Strength:</div>
              <div className="button-box" style={{ left: "3.5%" }}>
                {selectedForms[id] &&
                  salt.salt_forms_json[selectedForms[id]] &&
                  Object.keys(salt.salt_forms_json[selectedForms[id]]).map(
                    (strength, index) => (
                      <button
                        key={index}
                        onClick={() => {
                          setSelectedStrengths((prevStrengths) => ({
                            ...prevStrengths,
                            [id]: strength,
                          }));
                          setSelectedPackagings((prevPackagings) => ({
                            ...prevPackagings,
                            [id]: null,
                          }));
                        }}
                        className={`buttons
                          ${
                            selectedStrengths[id] === strength &&
                            !lowestSellingPrices[id]
                              ? "not-av-selected"
                              : ""
                          }
                          ${
                            selectedStrengths[id] !== strength &&
                            lowestSellingPrices[id]
                              ? "not-selected"
                              : ""
                          }
                                                    ${
                                                      selectedStrengths[id] ===
                                                        strength &&
                                                      lowestSellingPrices[id]
                                                        ? "selected"
                                                        : ""
                                                    }

                          ${
                            selectedStrengths[id] !== strength &&
                            !lowestSellingPrices[id]
                              ? "not-av-not-selected"
                              : ""
                          }
                          ${index > 1 && !showMoreStrengths ? "hidden" : ""}
                        `}
                      >
                        {strength}
                      </button>
                    )
                  )}
                {selectedForms[id] &&
                  salt.salt_forms_json[selectedForms[id]] &&
                  Object.keys(salt.salt_forms_json[selectedForms[id]]).length >
                    2 && (
                    <button onClick={toggleShowMoreStrengths} className="more">
                      {showMoreStrengths ? "Less" : "More"}
                    </button>
                  )}
              </div>
            </div>
            <div className="row-3-pack  flex ">
              <div className="form-text">Packaging:</div>
              <div className="button-box">
                {selectedForms[id] &&
                  selectedStrengths[id] &&
                  salt.salt_forms_json[selectedForms[id]][
                    selectedStrengths[id]
                  ] &&
                  Object.keys(
                    salt.salt_forms_json[selectedForms[id]][
                      selectedStrengths[id]
                    ]
                  ).map((pack, index) => (
                    <button
                      key={index}
                      onClick={() =>
                        setSelectedPackagings((prevPackagings) => ({
                          ...prevPackagings,
                          [id]: pack,
                        }))
                      }
                      className={`buttons focus:outline-none
                        ${
                          selectedPackagings[id] === pack &&
                          !lowestSellingPrices[id]
                            ? "not-av-selected"
                            : ""
                        }
                        ${
                          selectedPackagings[id] !== pack &&
                          lowestSellingPrices[id]
                            ? "not-selected"
                            : ""
                        }

                        ${
                          selectedPackagings[id] === pack &&
                          lowestSellingPrices[id]
                            ? "selected"
                            : ""
                        }

                        ${
                          selectedPackagings[id] !== pack &&
                          !lowestSellingPrices[id]
                            ? "not-av-not-selected"
                            : ""
                        }
                        ${index > 1 && !showMorePackagings ? "hidden" : ""}
                      `}
                    >
                      {pack}
                    </button>
                  ))}
                {selectedForms[id] &&
                  selectedStrengths[id] &&
                  salt.salt_forms_json[selectedForms[id]][selectedStrengths[id]]
                    .length > 2 && (
                    <button onClick={toggleShowMorePackagings} className="more">
                      {showMorePackagings ? "Less" : "More"}
                    </button>
                  )}
              </div>
            </div>
          </div>
          <div className="center-box flex flex-col">
            <div className="row-1-salt">{salt.salt}</div>
            <div className="row-2-salt">
              <span style={{ marginRight: "0.5em" }}>{selectedForms[id]}</span>{" "}
              {" | "}
              <span style={{ marginRight: "0.5em" }}>
                {selectedStrengths[id]}
              </span>
              {" | "}
              <span style={{ marginRight: "0.5em" }}>
                {selectedPackagings[id]}
              </span>
            </div>
          </div>
          <div className="right-box">
            <div
              className={`  ${lowestSellingPrices[id] ? "price" : "no-store"}`}
            >
              {lowestSellingPrices[id]
                ? `From ${lowestSellingPrices[id]}`
                : "No stores selling this product near you"}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;





