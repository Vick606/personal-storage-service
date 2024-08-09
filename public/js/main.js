document.addEventListener('DOMContentLoaded', () => {
    const newFolderBtn = document.getElementById('newFolderBtn');
    const shareFolderForm = document.getElementById('shareFolderForm');
    const shareLinkDiv = document.getElementById('shareLink');
    const shareLinkInput = document.getElementById('shareLinkInput');
    const fileUploadForm = document.getElementById('fileUploadForm');
    const deleteFileBtns = document.querySelectorAll('.deleteFileBtn');

    if (newFolderBtn) {
        newFolderBtn.addEventListener('click', () => {
            const folderName = prompt('Enter folder name:');
            if (folderName) {
                fetch('/folders', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ name: folderName }),
                })
                .then(response => response.json())
                .then(data => {
                    if (data.id) {
                        window.location.reload();
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    }

    if (shareFolderForm) {
        shareFolderForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const folderId = window.location.pathname.split('/').pop();
            const duration = e.target.elements.duration.value;

            fetch(`/share/${folderId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ duration }),
            })
            .then(response => response.json())
            .then(data => {
                if (data.shareLink) {
                    shareLinkInput.value = data.shareLink;
                    shareLinkDiv.classList.remove('hidden');
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to generate share link');
            });
        });
    }

    if (shareLinkInput) {
        shareLinkInput.addEventListener('click', () => {
            shareLinkInput.select();
            document.execCommand('copy');
            alert('Share link copied to clipboard!');
        });
    }

    if (fileUploadForm) {
        fileUploadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const formData = new FormData(fileUploadForm);
            const folderId = window.location.pathname.split('/').pop();

            fetch(`/files/upload`, {
                method: 'POST',
                body: formData,
            })
            .then(response => response.json())
            .then(data => {
                if (data.file) {
                    window.location.reload();
                }
            })
            .catch(error => {
                console.error('Error:', error);
                alert('Failed to upload file');
            });
        });
    }

    deleteFileBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const fileId = btn.dataset.fileId;
            if (confirm('Are you sure you want to delete this file?')) {
                fetch(`/files/${fileId}`, {
                    method: 'DELETE',
                })
                .then(response => response.json())
                .then(data => {
                    if (data.message === 'File deleted successfully') {
                        btn.closest('li').remove();
                    }
                })
                .catch(error => {
                    console.error('Error:', error);
                    alert('Failed to delete file');
                });
            }
        });
    });
});