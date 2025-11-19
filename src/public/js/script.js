// Script para fechar a sidebar quando o mouse sair
const sidebar = document.getElementById('sidebar');

if (sidebar) {
  // Detecta quando o mouse entra na sidebar
  sidebar.addEventListener('mouseenter', function () {
    sidebar.style.width = '250px';
  });

  // Detecta quando o mouse sai da sidebar
  sidebar.addEventListener('mouseleave', function () {
    sidebar.style.width = '80px';
  });
}

// Funcionalidade de Like nos posts
document.addEventListener('DOMContentLoaded', () => {
  const likeButtons = document.querySelectorAll('.like-btn');

  likeButtons.forEach(btn => {
    btn.addEventListener('click', async function () {
      const postId = this.getAttribute('data-post-id');
      const likeCount = this.querySelector('.like-count');

      try {
        const response = await fetch(`/posts/${postId}/like`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          }
        });

        const data = await response.json();

        if (response.ok) {
          likeCount.textContent = data.likesCount;
          this.classList.toggle('liked');
        } else {
          alert(data.message || 'Erro ao curtir post');
        }
      } catch (error) {
        console.error('Erro:', error);
        alert('Erro ao processar like');
      }
    });
  });
});

// MUDAR A COR DO BACKGROUND
document.addEventListener('DOMContentLoaded', () => {
  const bgColorPicker = document.getElementById('bgColorPicker');

  // Define a cor padrão se não houver uma no localStorage
  if (bgColorPicker) {
    const savedBgColor = localStorage.getItem('backgroundColor') || '#1c1c1c';
    document.body.style.setProperty('--background-color', savedBgColor);
    bgColorPicker.value = savedBgColor;

    // Adiciona o evento de mudança de cor
    bgColorPicker.addEventListener('input', () => {
      const selectedColor = bgColorPicker.value;
      document.body.style.setProperty('--background-color', selectedColor);
      localStorage.setItem('backgroundColor', selectedColor);
    });
  }
});
