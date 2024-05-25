'use client';
import {useState} from 'react';

export default function TheatreCard({children, className, theatreId, imgSrc, title}) {
	return (
		<div className={"col-6 col-lg-3 mb-4"}>
			<a href={"/theatre/?theatreId=" + theatreId} style={{color: "black", textDecoration: "none" }}>
				<div className="card m-auto" style={{height: '100%', width: '95%'}}>
					<img src={imgSrc} className="card-img-top m-auto" alt={title + ' Poster'} style={{height: '80%', width: '100%'}} draggable="false"/>
					<div className="card-body" style={{width: '100%'}}>
						<h5 className="card-title" style={{WebkitLineClamp: '1', 'display': '-webkit-box',  WebkitBoxOrient: 'vertical', 'overflow': 'hidden'}}>{title}</h5>
						<p className="card-text" style={{WebkitLineClamp: '4', 'display': '-webkit-box',  WebkitBoxOrient: 'vertical', 'overflow': 'hidden'}}>{children}</p>
					</div>
				</div>
			</a>
		</div>
	);
}