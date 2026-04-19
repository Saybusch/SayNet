import { useEffect, useRef, useState } from "react";
import '../App.css';
export default function Navbar(){
    const [themeSwitch, setThemeSwitch] = useState(false)
    const [isNavOpen, setIsNavOpen] = useState(false)
    //Start
    useEffect(() => {
            const eventSource = new EventSource('fetch_stats.php');
            const currentTheme = localStorage.getItem('theme');
            if(currentTheme){
                document.documentElement.setAttribute('data-theme', currentTheme);
                if(currentTheme === 'dark'){
                    setThemeSwitch(true)
                }
            }
    }, [])
    //Change Theme from Light to Dark and vice versa
    useEffect(() => {
        if(themeSwitch){
            document.documentElement.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
        else {
            document.documentElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        }
    }, [themeSwitch])
    useEffect(() => {
        document.body.classList.toggle("nav-open", isNavOpen);
    }, [isNavOpen])
    const openNav = () => setIsNavOpen(true)
    const closeNav = (e) => {
        e.preventDefault()
        setIsNavOpen(false)
    }
    const lightSwitch = () => {
        console.log("change")
        if(themeSwitch) setThemeSwitch(false)
        else setThemeSwitch(true)
    }
    return (
        <header>
            <button onClick={() => openNav()}>
                <div></div>
                <div></div>
                <div></div>
            </button>
            <label htmlFor="colorSwitcher">
                <input id="colorSwitcher" type="checkbox" onChange={() => lightSwitch()}></input>
                <span></span>
            </label>
            <nav id="sideNav">
                <a className="closebtn" onClick={(e) => closeNav(e)}>&#x2715;</a>
                <ul>
                    <li><a href="/">Home</a></li>
                    <li><a href="/downloads">Modpacks</a></li>
                </ul>
            </nav>
        </header>
    )
}
