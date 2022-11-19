document.addEventListener('DOMContentLoaded', () => {
	//wrapper animation
	anime.timeline({
		 targets: ".welcome",
		 easing: "easeOutExpo",
	})
	 .add({
		width: ["0vw", "100vw"],
		opacity: 1,
		duration: 1200,
	})
	 .add({
		delay: 2700,
		translateX: "100vw",
		duration: 1500,
		complete: function(anime) {
		 document.querySelector('.welcome').remove();
	 }
	})

	//text animation
	anime({
		targets: ".heading",
		delay: 400,
		opacity: 1,
		duration: 1800,
		translateY: ["-30px", "0px"],
		easing: "easeOutExpo",
	});

	//text-sm animation
	anime({
		targets: ".sub-heading",
		delay: 600,
		opacity: 1,
		duration: 1800,
		translateY: ["-30px", "0px"],
		easing: "easeOutExpo",
	});

	//loader animation
	anime({
		targets: ".loader",
		delay: 2000,
		duration: 2300,
		width: ["0", "100%"],
		easing: "easeOutExpo",
	});

	//loader-wrapper animation
	anime({
		targets: ".loader-wrapper",
		delay: 1500,
		duration: 1800,
		opacity: 1,
		easing: "easeOutExpo",
	});
})

//paragraphs
	anime({
		targets: 'p',
  		opacity: 1,
  		duration: 1800,
  		translateY: ["-30px", "0px"],
  		easing: "easeOutExpo",
		delay: (el, i) => 5200 + 100 * i,
	})

	// anime({
	// targets: '.info',
  	// opacity: 1,
  	// duration: 1800,
  	// translateY: ["-30px", "0px"],
  	// easing: "easeOutExpo",
	// 	delay: (el, i) => 5200 + 100 * i,
	// })
