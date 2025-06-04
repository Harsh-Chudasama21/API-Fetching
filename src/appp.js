import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./images/pokemon-logo.jpg"

const App = () => { // row  function syntax
  const [pokemonData, setPokemonData] = useState([]);  // pokemondata to fetch data from pokemon-api
  const [loading, setLoading] = useState(true);  // loading status while fetching data from pokemon-api...
  const [selectedPokemon, setSelectedPokemon] = useState(null);  // tracking the name of the selected Pokemon
  const [selectedPokemonData, setSelectedPokemonData] = useState(null);  // tracking the name of the selected

  useEffect(() => {fetchPokemonData();}, []);  // when the components mount, fetch the data from pokemon-api (with an empty array [])

  const fetchPokemonData = async () => // just an api call to fetch the list of pokemon
  { try {
          const response = await fetch("https://pokeapi.co/api/v2/pokemon"); // await is used only with async function
          const data = await response.json(); // JSON - to parse the response to the body. // await- to make the code more readable and avoid nested callbacks. 
          setPokemonData(data.results); 
          setLoading(false); // just a stopper once the data has been fetched
        } catch (error)
        {  
          console.error("Error fetching Pokémon data:", error.message);
          setLoading(false);
        }
  };

  const handlePokemonClick = async (pokemonName) => // to select a single pokemon name in the left container
  {
    setSelectedPokemon(pokemonName); // 
    try
    {
      setLoading(true); const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();  // JSON - to parse the response to the body. // await- to make the code more readable and avoid nested callbacks.
      setSelectedPokemonData(data);   // The detailed data is stored in the selectedPokemonData state
      setLoading(false);
    } catch (error) 
    {
      console.error("Error fetching Pokémon data:", error.message); /* When an error occurs during the execution of the try block, the code in the catch block is executed,
                                                                     and the error object contains information about the error, including its message, stack trace, and other properties. */
      setLoading(false);
    }
  };
  
  return (
    <div className="App">
      <div className="TitleSection"> 
        <img src={logo} alt="Pokemon Logo" className="LogoImage" />
        <h1>Pokemon-API</h1> 
      </div>
      <div className="TwoColumnLayout">
        
        <div className="PokemonList">
          {loading ? ( 
            <div>Loading...</div>) : (
            <ul>
              {pokemonData.map((pokemon, index) => (
                <li key={index}onClick={() => handlePokemonClick(pokemon.name)}className={selectedPokemon === pokemon.name ? "active" : ""}>
                  <span className="PokemonNumber">{index + 1}</span> {/* className attribute is applied to span element */}
                  <img src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}alt={pokemon.name}/>{pokemon.name}
                </li>
              ) 
            )
          }
           </ul>
        )
      }
        </div>
        <div className="RightContainer">
          {loading ?
           (
            <div>Loading...</div> // block level box is created on the webpage.
            ) : (
            <div className="SelectedPokemon">
              {selectedPokemonData && (
                <React.Fragment>
                  <img src={selectedPokemonData.sprites.front_default}alt={selectedPokemonData.name} />
                  <h2>{selectedPokemonData.name}</h2>
                  <div>
                    <b>Height:</b> {selectedPokemonData.height} dm
                  </div>
                  <div>
                    <b>Weight:</b> {selectedPokemonData.weight} hg
                  </div>
                  <div>
                      <b>Abilities:</b>{" "}{selectedPokemonData.abilities.map((ability) => ability.ability.name).join(", ")} {/* ability- callback() of the map method. (.join)- is used for extracting */}
                  </div>
                  <div> 
                    <b>Base Experience:</b>{" "} {selectedPokemonData.base_experience}
                  </div>
                </React.Fragment> // just to return multiple elements
                )
              }
            </div>
            )
          }
        </div>
      </div>
    </div>
  );
};

export default App;