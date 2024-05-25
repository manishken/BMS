'use client';
import React, {useEffect, useState} from 'react';
import {Dropdown} from 'react-bootstrap';
import { useRouter } from 'next/navigation';

export default function SearchBar(props) {
    const [search, setSearch] = useState('')
    const router = useRouter();
	const autoSuggestions = props.suggestions.map((suggestion) => {
		return <Dropdown.Item key={suggestion + 'SearchDropdownItem'} href={'/search?' + props.field + 'SearchBar=' + suggestion} tabIndex={0} className="text-light">{suggestion}</Dropdown.Item>
	});
	const [suggestionsShown, setSuggestionsShown] = useState(false);
	const suggestions= <Dropdown show={true} className='w-100'>
		<Dropdown.Menu className='w-100 bg-dark' style={{overflow: 'hidden'}}>
			<p className="fw-light text-light my-0 ms-3 bg-dark" style={{fontSize: '0.8rem'}}>Suggestions...</p>
			{autoSuggestions}
		</Dropdown.Menu>
	</Dropdown>;

	function handleBlur(event) {
		if(event.relatedTarget) {
			event.preventDefault();
		} else {
			setSuggestionsShown(false);
		}
	}

    const searchInput = (event) => {
        setSearch(event.target.value)
    }

    useEffect(() => {
        console.log(search)
    },[])

	return (
		<div className={(props.floating ? "card-img-overlay d-flex" : "") + " justify-content-center align-items-center"} style={{top: '9rem'}}>
			<div className={(!props.floating ? "w-100" : "") + " form-floating m-auto dropdown"} style={{width: '40%'}}>
				<input id={props.field + 'SearchBar'} onChange={searchInput} type="text" autoComplete="off" className="form-control form-control-lg bg-white bg-opacity-75 border-0 dropdown-toggle" data-bs-toggle="dropdown" maxLength={128} style={{height: '3.5rem'}} placeholder={props.children} name={props.field + 'SearchBar'} onFocus={() => setSuggestionsShown(true)} onBlur={(event) => handleBlur(event)}/>
				<label htmlFor={props.field + 'SearchBar'} style={{color: 'black'}}>{props.children}</label>
				{suggestionsShown ? suggestions : null}
			</div>
		</div>
	);
}