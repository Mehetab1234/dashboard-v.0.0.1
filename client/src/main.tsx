import { createRoot } from "react-dom/client";
import App from "./App";
import "./index.css";
import { library } from '@fortawesome/fontawesome-svg-core';
import { 
  faServer, faTachometerAlt, faUserShield, faCog, 
  faBars, faTimes, faSearch, faBell, faUsers, 
  faHdd, faClock, faMicrochip, faMemory, faCube,
  faCubes, faDragon, faEgg
} from '@fortawesome/free-solid-svg-icons';

// Add FontAwesome icons to the library for use across the app
library.add(
  faServer, faTachometerAlt, faUserShield, faCog, 
  faBars, faTimes, faSearch, faBell, faUsers, 
  faHdd, faClock, faMicrochip, faMemory, faCube,
  faCubes, faDragon, faEgg
);

createRoot(document.getElementById("root")!).render(<App />);
