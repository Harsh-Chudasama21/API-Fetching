import React, { useState, useEffect } from "react";
import "./App.css";
import logo from "./images/pokemon-logo.jpg";

const LoadingSpinner = () => (
  <div className="loading">
    <div className="spinner"></div>
    <span>Loading...</span>
  </div>
);

const PokemonCard = ({ pokemon, index, isActive, onClick }) => (
  <li
    onClick={() => onClick(pokemon.name)}
    className={isActive ? "active" : ""}
  >
    <span className="PokemonNumber">#{index + 1}</span>
    <img
      src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${index + 1}.png`}
      alt={pokemon.name}
    />
    <span className="PokemonName">{pokemon.name}</span>
  </li>
);

const PokemonDetails = ({ pokemon }) => {
  if (!pokemon) return null;
  
  return (
    <div className="SelectedPokemon">
      <img 
        src={pokemon.sprites.front_default} 
        alt={pokemon.name}
        className="PokemonSprite"
      />
      <h2>{pokemon.name}</h2>
      <div className="PokemonStats">
        <div>
          <b>Height:</b> {pokemon.height / 10}m
        </div>
        <div>
          <b>Weight:</b> {pokemon.weight / 10}kg
        </div>
        <div>
          <b>Abilities:</b>{" "}
          {pokemon.abilities.map((ability) => ability.ability.name).join(", ")}
        </div>
        <div>
          <b>Base Experience:</b> {pokemon.base_experience}
        </div>
        <div>
          <b>Types:</b>{" "}
          {pokemon.types.map((type) => type.type.name).join(", ")}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [pokemonData, setPokemonData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPokemon, setSelectedPokemon] = useState(null);
  const [selectedPokemonData, setSelectedPokemonData] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [error, setError] = useState(null);
  const itemsPerPage = 10;

  const fetchPokemonData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("https://pokeapi.co/api/v2/pokemon?limit=151");
      const data = await response.json();
      setPokemonData(data.results);
    } catch (error) {
      setError("Failed to fetch Pokémon data. Please try again later.");
      console.error("Error fetching Pokémon data:", error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPokemonData();
  }, []);

  const handlePokemonClick = async (pokemonName) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedPokemon(pokemonName);
      const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemonName}`);
      const data = await response.json();
      setSelectedPokemonData(data);
    } catch (error) {
      setError("Failed to fetch Pokémon details. Please try again.");
      console.error("Error fetching Pokémon details:", error.message);
    } finally {
      setLoading(false);
    }
  };

  const nextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const prevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentPokemonData = pokemonData.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(pokemonData.length / itemsPerPage);

  return (
    <div className="App">
      <div className="TitleSection">
        <img src={logo} alt="Pokemon Logo" className="LogoImage" />
        <h1>Pokédex Explorer</h1>
      </div>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="TwoColumnLayout">
        <div className="PokemonList">
          {loading && !currentPokemonData.length ? (
            <LoadingSpinner />
          ) : (
            <>
              <ul>
                {currentPokemonData.map((pokemon, index) => (
                  <PokemonCard
                    key={pokemon.name}
                    pokemon={pokemon}
                    index={index + indexOfFirstItem}
                    isActive={selectedPokemon === pokemon.name}
                    onClick={handlePokemonClick}
                  />
                ))}
              </ul>
              <div className="Pagination">
                <button 
                  onClick={prevPage} 
                  disabled={currentPage === 1}
                >
                  Previous
                </button>
                <span>Page {currentPage} of {totalPages}</span>
                <button 
                  onClick={nextPage} 
                  disabled={currentPage === totalPages}
                >
                  Next
                </button>
              </div>
            </>
          )}
        </div>

        <div className="RightContainer">
          {loading && selectedPokemon ? (
            <LoadingSpinner />
          ) : (
            <PokemonDetails pokemon={selectedPokemonData} />
          )}
        </div>
      </div>
    </div>
  );
};

export default App;