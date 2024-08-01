// Card progetto attuale
function toggleDetails(event, detailsId) {
    event.preventDefault();
    const detailsElement = document.getElementById(detailsId);
    const courseItem = detailsElement.closest('.ag-courses_item');
    if (courseItem.classList.contains('expanded')) {
        courseItem.classList.remove('expanded');
        detailsElement.style.display = 'none';
    } else {
        // Collapse any other expanded cards
        document.querySelectorAll('.ag-courses_item.expanded').forEach(item => {
            item.classList.remove('expanded');
            item.querySelector('.ag-courses-item_details').style.display = 'none';
        });
        // Expand the clicked card
        courseItem.classList.add('expanded');
        detailsElement.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    // Ensure all cards start in the collapsed state
    document.querySelectorAll('.ag-courses_item').forEach(item => {
        item.classList.remove('expanded');
        item.querySelector('.ag-courses-item_details').style.display = 'none';
    });
});

//accordion
document.querySelectorAll('.accordion__item').forEach(item => {
    item.addEventListener('mouseenter', () => {
      // Espande la card al passaggio del mouse
      item.querySelector('.accordion__item-content').style.maxHeight = item.querySelector('.accordion__item-content').scrollHeight + 'px';
    });
  
    item.addEventListener('mouseleave', () => {
      // Ristabilisce le dimensioni originali al di fuori del passaggio del mouse
      item.querySelector('.accordion__item-content').style.maxHeight = '0';
    });
  });
  
