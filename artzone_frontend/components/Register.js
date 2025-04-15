const handleRegister = async (event) => {
    event.preventDefault(); // Prevent form reload
    try {
        const response = await fetch("http://localhost:5000/api/auth/register", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        console.log("Server response:", data);

        if (response.ok) {
            alert("Registration successful!");
        } else {
            alert(`Error: ${data.message}`);
        }
    } catch (error) {
        console.error("Registration error:", error);
    }
};
