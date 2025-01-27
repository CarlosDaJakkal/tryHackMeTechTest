import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import { SearchProvider } from "./context/SearchContext"
import { SearchInput } from "./components/SearchInput"
import { SearchResults } from "./components/SearchResults"
import { Hotel } from "./pages/Hotel"
import { Country } from "./pages/Country"
import { City } from "./pages/City"

function App() {
  return (
    <Router>
      <SearchProvider>
        <div className="App">
          <header className="bg-gray-100 py-4">
            <div className="container mx-auto px-4">

            </div>
          </header>
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={
                <div className="w-full max-w-md mx-auto relative">
                  <SearchInput />
                  <SearchResults />
                </div>
              } />
              <Route path="/hotels/:id" element={<Hotel />} />
              <Route path="/countries/:id" element={<Country />} />
              <Route path="/cities/:id" element={<City />} />
            </Routes>
          </main>
        </div>
      </SearchProvider>
    </Router>
  )
}

export default App

