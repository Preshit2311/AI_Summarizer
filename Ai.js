        // DOM Elements
        const inputText = document.getElementById('inputText');
        const summarizeBtn = document.getElementById('summarizeBtn');
        const summaryOutput = document.getElementById('summaryOutput');
        const bulletPoints = document.getElementById('bulletPoints');
        const highlightKeyPoints = document.getElementById('highlightKeyPoints');
        const summaryLength = document.getElementById('summaryLength');
        const lengthValue = document.getElementById('lengthValue');
        const copyBtn = document.getElementById('copyBtn');
        const downloadBtn = document.getElementById('downloadBtn');
        const clearBtn = document.getElementById('clearBtn');
        const shareBtn = document.getElementById('shareBtn');
        const loadingIndicator = document.getElementById('loadingIndicator');
        const inputWordCount = document.getElementById('inputWordCount');
        const outputWordCount = document.getElementById('outputWordCount');
        const readingTime = document.getElementById('readingTime');
        const progressBar = document.getElementById('progressBar');
        const progressPercent = document.getElementById('progressPercent');
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notificationText');

        // Update word count
        function updateWordCount() {
            const text = inputText.value;
            const words = text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
            inputWordCount.textContent = words;
        }

        // Update length value display
        summaryLength.addEventListener('input', () => {
            lengthValue.textContent = `${summaryLength.value}%`;
        });

        inputText.addEventListener('input', updateWordCount);
        updateWordCount();

        // Show notification function
        function showNotification(message, isSuccess = true) {
            notificationText.textContent = message;
            notification.style.borderLeftColor = isSuccess ? 'var(--success)' : 'var(--error)';
            notification.classList.add('show');
            
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // Summarize Function
        summarizeBtn.addEventListener('click', () => {
            const text = inputText.value.trim();
            if (text === '') {
                showNotification('Please enter some text to summarize.', false);
                return;
            }

            loadingIndicator.style.display = 'block';
            summaryOutput.innerHTML = '';
            
            // Simulate progress
            let progress = 0;
            const progressInterval = setInterval(() => {
                progress += 5;
                progressBar.style.width = `${progress}%`;
                progressPercent.textContent = `${progress}%`;
                
                if (progress >= 100) {
                    clearInterval(progressInterval);
                }
            }, 100);

            // Simulate AI processing with a timeout
            setTimeout(() => {
                const summary = generateSummary(text, bulletPoints.checked, summaryLength.value, highlightKeyPoints.checked);
                summaryOutput.innerHTML = summary;
                
                // Update output word count and reading time
                const words = summary.trim() === '' ? 0 : countWords(summary);
                outputWordCount.textContent = words;
                readingTime.textContent = calculateReadingTime(words);
                
                loadingIndicator.style.display = 'none';
                progressBar.style.width = '0%';
                
                showNotification('Text summarized successfully!');
            }, 2000);
        });

        // Calculate reading time
        function calculateReadingTime(wordCount) {
            const wordsPerMinute = 200;
            return Math.ceil(wordCount / wordsPerMinute);
        }

        // Count words in HTML text
        function countWords(html) {
            const div = document.createElement('div');
            div.innerHTML = html;
            const text = div.textContent || div.innerText || '';
            return text.trim() === '' ? 0 : text.trim().split(/\s+/).length;
        }

        // Copy Function
        copyBtn.addEventListener('click', () => {
            const summary = summaryOutput.innerText;
            if (summary === '' || summary === 'Your summary will appear here. Click the "Summarize Text" button to generate an AI-powered summary.') {
                showNotification('No summary to copy.', false);
                return;
            }

            navigator.clipboard.writeText(summary)
                .then(() => {
                    showNotification('Summary copied to clipboard!');
                })
                .catch(err => {
                    console.error('Failed to copy: ', err);
                    showNotification('Failed to copy summary.', false);
                });
        });

        // Download Function
        downloadBtn.addEventListener('click', () => {
            const summary = summaryOutput.innerText;
            if (summary === '' || summary === 'Your summary will appear here. Click the "Summarize Text" button to generate an AI-powered summary.') {
                showNotification('No summary to download.', false);
                return;
            }

            const blob = new Blob([summary], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'ai-summary.txt';
            document.body.appendChild(a);
            a.click();
            setTimeout(() => {
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
            }, 0);
            
            showNotification('Summary downloaded successfully!');
        });

        // Clear Function
        clearBtn.addEventListener('click', () => {
            inputText.value = '';
            summaryOutput.innerHTML = '<p>Your summary will appear here. Click the "Summarize Text" button to generate an AI-powered summary.</p>';
            inputWordCount.textContent = '0';
            outputWordCount.textContent = '0';
            readingTime.textContent = '0';
            
            showNotification('Text cleared.');
        });

        // Share Function
        shareBtn.addEventListener('click', () => {
            const summary = summaryOutput.innerText;
            if (summary === '' || summary === 'Your summary will appear here. Click the "Summarize Text" button to generate an AI-powered summary.') {
                showNotification('No summary to share.', false);
                return;
            }

            if (navigator.share) {
                navigator.share({
                    title: 'AI Text Summary',
                    text: summary,
                })
                .then(() => showNotification('Summary shared successfully!'))
                .catch(error => showNotification('Error sharing summary.', false));
            } else {
                showNotification('Web Share API not supported in your browser.', false);
            }
        });

        // Mock AI Summary Generation with more advanced simulation
        function generateSummary(text, useBulletPoints, lengthRatio, highlight) {
            // This is a mock function that simulates AI summarization
            // In a real application, this would call an AI API
            
            const ratio = lengthRatio / 100;
            const sentences = text.split('. ');
            const sentenceCount = Math.max(1, Math.floor(sentences.length * ratio));
            
            // Select some sentences to simulate extraction of important content
            const selectedSentences = [];
            for (let i = 0; i < sentenceCount; i++) {
                const index = Math.floor(i * (sentences.length / sentenceCount));
                if (index < sentences.length && sentences[index].trim().length > 10) {
                    let sentence = sentences[index].trim();
                    if (sentence.slice(-1) !== '.') sentence += '.';
                    
                    // Simulate highlighting of key terms
                    if (highlight) {
                        sentence = sentence.replace(/(AI|artificial intelligence|machine|intelligence)/gi, 
                            '<span class="highlight">$1</span>');
                    }
                    
                    selectedSentences.push(sentence);
                }
            }
            
            if (useBulletPoints) {
                let bulletSummary = '<ul>';
                selectedSentences.forEach(sentence => {
                    if (sentence.trim().length > 0) {
                        bulletSummary += `<li>${sentence}</li>`;
                    }
                });
                bulletSummary += '</ul>';
                return bulletSummary;
            } else {
                return `<p>${selectedSentences.join(' ')}</p>`;
            }
        }
