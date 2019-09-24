  const triggers = document.querySelectorAll('.cool > li');
  const nav = document.querySelector('nav');
  const dropdownBackground = document.querySelector('.dropdownBackground');
  const dropdownBackgroundWrap = document.querySelector('.dropdownBackgroundWrap');
  let dropdownActive = false;
  
  const handleMouseEnter = (e) => {
    const trigger = e.currentTarget;
    trigger.classList.add('trigger-enter');
    dropdownActive = true;
    
    /* Position and size of background */
    const navCoords = nav.getBoundingClientRect(),
          dropdown = trigger.querySelector('.dropdown'),
          dropdownCoords = dropdown.getBoundingClientRect();
    const backgroundCoords = {
      top: dropdownCoords.top - navCoords.top,
      left: dropdownCoords.left - navCoords.left,
      width: dropdownCoords.width,
      height: dropdownCoords.height }
    dropdownBackground.style.setProperty('transform', `translate(${backgroundCoords.left}px, ${backgroundCoords.top}px)`);
    dropdownBackground.style.width = `${backgroundCoords.width}px`;
    dropdownBackground.style.height = `${backgroundCoords.height}px`;
    
    setTimeout(() => {
      if(trigger.classList.contains('trigger-enter')){
        trigger.classList.add('trigger-enter-active');
        dropdownBackground.classList.add('open');
        dropdownBackgroundWrap.classList.add('open');
      }
    }, 150);
  }
  
  const handleMouseLeave = (e) => {
    const trigger = e.currentTarget;
    trigger.classList.remove('trigger-enter', 'trigger-enter-active');
    dropdownBackground.classList.remove('open');
    dropdownActive = false;
    setTimeout(() => !dropdownActive && dropdownBackgroundWrap.classList.remove('open'), 150);
  }
  
  triggers.forEach(trigger => trigger.addEventListener('mouseenter', handleMouseEnter));
  triggers.forEach(trigger => trigger.addEventListener('mouseleave', handleMouseLeave));
  