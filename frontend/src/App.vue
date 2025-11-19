<template>
  <div class="container">
    <h1>ИНСТРУМЕНТ НАГРУЗОЧНОГО ТЕСТИРОВАНИЯ</h1>
    
    <div class="form">
      <div class="field">
        <label>Количество запросов</label>
        <input type="number" v-model.number="requestsCount" :disabled="isRunning" min="1" max="10000">
      </div>
      
      <div class="field">
        <label>Задержка (мс):</label>
        <input type="number" v-model.number="delayMs" :disabled="isRunning" min="0" max="10000">
      </div>
      
      <button @click="startTest" :disabled="isRunning">
        {{ isRunning ? 'Running...' : 'Старт нагрузочного теста' }}
      </button>
    </div>

    <div v-if="stats.sent > 0" class="stats">
      <h2>Результаты</h2>
      <div class="stat-item">
        <span>Отправлено:</span>
        <span>{{ stats.sent }} / {{ requestsCount }}</span>
      </div>
      <div class="stat-item">
        <span>Успешно:</span>
        <span class="success">{{ stats.success }}</span>
      </div>
      <div class="stat-item">
        <span>Ошибки:</span>
        <span class="error">{{ stats.failed }}</span>
      </div>
      <div class="stat-item">
        <span>Прошло время:</span>
        <span>{{ elapsedTime }}s</span>
      </div>
      <div class="stat-item">
        <span>Среднее время отклика:</span>
        <span>{{ avgResponseTime }}мс</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      requestsCount: 100,
      delayMs: 50,
      isRunning: false,
      stats: {
        sent: 0,
        success: 0,
        failed: 0,
      },
      startTime: null,
      elapsedTime: 0,
      intervalId: null,
      responseTimes: [],
    };
  },
  computed: {
    avgResponseTime() {
      if (this.responseTimes.length === 0) return 0;
      const sum = this.responseTimes.reduce((a, b) => a + b, 0);
      return Math.round(sum / this.responseTimes.length);
    },
  },
  methods: {
    async startTest() {
      this.isRunning = true;
      this.stats = { sent: 0, success: 0, failed: 0 };
      this.responseTimes = [];
      this.startTime = Date.now();
      this.elapsedTime = 0;

      this.intervalId = setInterval(() => {
        this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      }, 100);

      const apiUrl = 'http://localhost:3000/items?limit=10&offset=0';

      for (let i = 0; i < this.requestsCount; i++) {
        this.stats.sent++;
        
        const reqStartTime = Date.now();
        
        try {
          const response = await fetch(apiUrl);
          const responseTime = Date.now() - reqStartTime;
          this.responseTimes.push(responseTime);
          
          if (response.ok) {
            this.stats.success++;
          } else {
            this.stats.failed++;
          }
        } catch (error) {
          this.stats.failed++;
        }

        if (this.delayMs > 0 && i < this.requestsCount - 1) {
          await new Promise(resolve => setTimeout(resolve, this.delayMs));
        }
      }

      clearInterval(this.intervalId);
      this.elapsedTime = Math.floor((Date.now() - this.startTime) / 1000);
      this.isRunning = false;
    },
  },
};
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 50px auto;
  padding: 20px;
  font-family: Arial, sans-serif;
}

h1 {
  text-align: center;
  color: #333;
}

.form {
  background: #f5f5f5;
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 30px;
}

.field {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
  color: #555;
}

input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 14px;
  box-sizing: border-box;
}

button {
  width: 100%;
  padding: 12px;
  background: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  font-size: 16px;
  cursor: pointer;
  margin-top: 10px;
}

button:hover:not(:disabled) {
  background: #45a049;
}

button:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.stats {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.stats h2 {
  margin-top: 0;
  color: #333;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  border-bottom: 1px solid #eee;
}

.stat-item:last-child {
  border-bottom: none;
}

.success {
  color: #4CAF50;
  font-weight: bold;
}

.error {
  color: #f44336;
  font-weight: bold;
}
</style>