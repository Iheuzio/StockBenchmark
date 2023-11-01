document.addEventListener('DOMContentLoaded', async () => {
  // Function to fetch and display quotes
  const fetchQuotes = async () => {
    try {
      const response = await fetch('http://localhost:3000/quotes'); 
      if (response.ok) {
        const quotes = await response.json();
        const quotesContainer = document.getElementById('quotes');
        quotesContainer.innerHTML = ''; // Clear previous quotes
        quotes.forEach(quote => {
          const quoteDiv = document.createElement('div');
          quoteDiv.innerHTML = `<p><strong>${quote.author}:</strong> ${quote.quote}</p>`;
          quotesContainer.appendChild(quoteDiv);
        });
      } else {
        console.error('Failed to fetch quotes:', response.status);
      }
    } catch (error) {
      console.error('Error fetching quotes:', error);
    }
  };

  // Fetch and display quotes when the page loads
  await fetchQuotes();

  // Handle form submission
  const quoteForm = document.getElementById('quoteForm');
  quoteForm.addEventListener('submit', async (event) => {
    event.preventDefault(); // Prevent the form submission from reloading the page

    const authorInput = document.getElementById('author');
    const quoteInput = document.getElementById('quote');

    const newQuote = {
      author: authorInput.value,
      quote: quoteInput.value,
    };

    try {
      const response = await fetch('http://localhost:3000/new-quote', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newQuote),
      });

      if (response.ok) {
        const result = await response.json();
        console.log('Quote added successfully:', result);
        // Clear form inputs
        authorInput.value = '';
        quoteInput.value = '';
        // Fetch and display quotes again to show the new one
        await fetchQuotes();
      } else {
        console.error('Failed to add a new quote:', response.status);
        const resultContainer = document.getElementById('result');
        resultContainer.textContent = 'Error: Failed to add a new quote';
      }
    } catch (error) {
      console.error('Error adding a new quote:', error);
      const resultContainer = document.getElementById('result');
      resultContainer.textContent = 'Error: Failed to add a new quote';
    }
  });
});
