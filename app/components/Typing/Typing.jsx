"use client"
import React from 'react'
import Typewriter from 'typewriter-effect';

const Typing = () => {
	return (
		<Typewriter
			options={{
				strings: ['Code for a Brighter Tomorrow', 'Create new and innovative solutions', 'Collaborate on different platforms'],
				autoStart: true,
				loop: true,
				deleteSpeed: 10,
			}}
		/>
	)
}

export default Typing