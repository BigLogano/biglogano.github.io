// These are my project's unique Supabase credentials from the dashboard.
// The URL points to my project's API endpoint.
// The anon key is a public API key that lets me interact with the database in a safe way.
const SUPABASE_URL = "https://lzhnwrpdmlbcvsotrvln.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx6aG53cnBkbWxiY3Zzb3RydmxuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAwNDgxMTIsImV4cCI6MjA2NTYyNDExMn0.aHCn6wDMH8kxeNth73WRaGQEHymUsUj9HDIjLEM11Mc";

// This creates a Supabase client instance that I can use to interact with my database.
// I renamed the variable to "client" to avoid shadowing the global "supabase" object.
const client = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// This event listener triggers when the user submits the form.
document
  .getElementById("note-form")
  .addEventListener("submit", async function (e) {
    e.preventDefault(); // This prevents the form from reloading the page

    // Grab the user's input from the form fields and trim any extra spaces
    const title = document.getElementById("title").value.trim();
    const body = document.getElementById("body").value.trim();

    // Simple check to make sure the form isn't empty
    if (!title || !body) {
      alert("Please enter both a title and body.");
      return;
    }

    // This inserts a new note into the "notes" table using Supabase
    const { data, error } = await client
      .from("notes")
      .insert([{ title, body }]);

    // Logging the response helps with debugging — I can check if it worked
    console.log("Insert result:", { data, error });

    // If there's an error inserting, let the user know
    if (error) {
      alert("Failed to insert note: " + error.message);
      return;
    }

    // If the insert worked, reset the form fields
    document.getElementById("title").value = "";
    document.getElementById("body").value = "";

    // Refresh the list of notes so the new one appears right away
    loadNotes();
  });

// This function fetches all the notes from the database and displays them on the page
async function loadNotes() {
  const list = document.getElementById("notes-list"); // UL element where notes go
  list.innerHTML = ""; // Clear the list before reloading new content

  // Get all notes from the "notes" table, sorted with newest first
  const { data, error } = await client
    .from("notes")
    .select("*")
    .order("id", { ascending: false });

  // If there's an error fetching the notes, log it
  if (error) {
    console.error("Load error:", error.message);
    return;
  }

  // Loop through each note and add it to the list
  data.forEach((note) => {
    const li = document.createElement("li");

    // Show title and body of the note, and add Load/Delete buttons
    li.innerHTML = `
      <strong>${note.title}
      <button onclick="loadSingleNote(${note.id})">Load</button>
      <button onclick="deleteNote(${note.id})">Delete</button>
    `;

    // Add the list item to the UL
    list.appendChild(li);
  });
}

// This function is called when the "Load" button is clicked.
// It loads a single note's content back into the form for editing.
async function loadSingleNote(id) {
  // Look for one note that matches the given ID
  const { data, error } = await client
    .from("notes")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    alert("Error loading note.");
    return;
  }

  // Put the note's title and body into the input fields
  document.getElementById("title").value = data.title;
  document.getElementById("body").value = data.body;
}

// This function deletes a note based on its ID
async function deleteNote(id) {
  // Remove the note from the database
  const { error } = await client.from("notes").delete().eq("id", id);

  // If there's an error, show it
  if (error) {
    alert("Failed to delete note.");
  } else {
    // Otherwise, reload the note list to reflect the change
    loadNotes();
  }
}

// Load all notes when the page first opens
loadNotes();
