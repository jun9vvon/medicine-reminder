document.addEventListener('DOMContentLoaded', () => {
    const medicineNameInput = document.getElementById('medicineName');
    const medicineTimeInput = document.getElementById('medicineTime');
    const addMedicineBtn = document.getElementById('addMedicineBtn');
    const medicationList = document.getElementById('medicationList');
    const feedbackMessage = document.getElementById('feedbackMessage');

    let medications = JSON.parse(localStorage.getItem('medications')) || [];
    let lastAccessDate = localStorage.getItem('lastAccessDate');

    function getTodayDateString() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    const todayDate = getTodayDateString();
    if (lastAccessDate !== todayDate) {
        medications.forEach(med => {
            med.taken = false;
        });
        localStorage.setItem('medications', JSON.stringify(medications));
        localStorage.setItem('lastAccessDate', todayDate);
        console.log('새로운 날이 시작되어 복용 상태가 초기화되었습니다.');
    }

    function renderMedications() {
        medicationList.innerHTML = '';
        if (medications.length === 0) {
            medicationList.innerHTML = '<li class="no-meds">아직 등록된 약이 없어요!</li>';
            return;
        }

        medications.forEach((med, index) => {
            const listItem = document.createElement('li');
            listItem.dataset.index = index;
            listItem.classList.toggle('taken', med.taken);

            listItem.innerHTML = `
                <span>${med.name} (${med.time})</span>
                <div class="actions">
                    <button class="take-btn">
                        ${med.taken ? '복용 완료 👍' : '복용 하기'}
                    </button>
                    <button class="delete-btn">삭제</button>
                </div>
            `;
            medicationList.appendChild(listItem);
        });
        updateFeedbackMessage();
    }

    addMedicineBtn.addEventListener('click', () => {
        const name = medicineNameInput.value.trim();
        const time = medicineTimeInput.value;

        if (name && time) {
            medications.push({ name, time, taken: false });
            localStorage.setItem('medications', JSON.stringify(medications));
            renderMedications();
            medicineNameInput.value = '';
            medicineTimeInput.value = '';
        } else {
            alert('약 이름과 복용 시간을 모두 입력해주세요.');
        }
    });

    medicationList.addEventListener('click', (event) => {
        const listItem = event.target.closest('li');
        if (!listItem) return;

        const index = parseInt(listItem.dataset.index);

        if (event.target.classList.contains('take-btn')) {
            medications[index].taken = !medications[index].taken;
            localStorage.setItem('medications', JSON.stringify(medications));
            renderMedications();
        } else if (event.target.classList.contains('delete-btn')) {
            if (confirm(`'${medications[index].name}' 약을 정말 삭제하시겠습니까?`)) {
                medications.splice(index, 1);
                localStorage.setItem('medications', JSON.stringify(medications));
                renderMedications();
            }
        }
    });

    function updateFeedbackMessage() {
        const totalMeds = medications.length;
        const takenMeds = medications.filter(med => med.taken).length;

        if (totalMeds === 0) {
            feedbackMessage.textContent = '오늘 복용할 약을 등록해보세요!';
        } else if (takenMeds === totalMeds) {
            feedbackMessage.textContent = '오늘 약 복용을 모두 완료했어요! 정말 멋져요! ✨';
        } else if (takenMeds > 0) {
            feedbackMessage.textContent = `총 ${totalMeds}개 중 ${takenMeds}개 복용 완료! 조금만 더 힘내세요! 💪`;
        } else {
            feedbackMessage.textContent = '아직 복용할 약이 남아있어요. 잊지 말고 챙겨드세요! 😊';
        }
    }

    renderMedications();
});