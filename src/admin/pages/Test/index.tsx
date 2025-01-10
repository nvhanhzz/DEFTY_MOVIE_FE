import React, { useState, useEffect } from "react";

const CountryFlagsToJson: React.FC = () => {
    const [countries, setCountries] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchCountries = async () => {
        setLoading(true);
        try {
            const response = await fetch("https://restcountries.com/v3.1/all");
            const data = await response.json();
            // Map data to extract name, flag, and nationality (male)
            const countryData = data
                .map((country: any) => ({
                    name: country.name.common,
                    flag: country.flags.png,
                    nationality: country.demonyms?.eng?.m || "Unknown", // Use male demonym
                }))
                .sort((a: any, b: any) => a.name.localeCompare(b.name)); // Sort alphabetically by name
            setCountries(countryData);
        } catch (error) {
            console.error("Error fetching countries:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCountries();
    }, []);

    const downloadJson = () => {
        const blob = new Blob([JSON.stringify(countries, null, 2)], {
            type: "application/json",
        });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = "countries_with_nationalities.json";
        link.click();
        URL.revokeObjectURL(url);
    };

    return (
        <div style={{ padding: "20px" }}>
            <h1>Country Names, Flags, and Male Nationalities</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div>
                    <button onClick={downloadJson} style={{ marginBottom: "10px" }}>
                        Download JSON
                    </button>
                    <ul>
                        {countries.map((country: any, index) => (
                            <li key={index}>
                                <img
                                    src={country.flag}
                                    alt={`${country.name} flag`}
                                    style={{ width: "30px", marginRight: "10px" }}
                                />
                                <strong>{country.name}</strong> - <em>{country.nationality}</em>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default CountryFlagsToJson;