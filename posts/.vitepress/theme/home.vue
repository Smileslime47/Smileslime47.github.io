<script setup lang="ts">
import { useData } from 'vitepress'

const { site } = useData()
</script>

<template>
  <div class="Home">
    <div class ="banner">
      <p class="big-title">Hi there</p>
      <h1 class="title">Smile_slime_47</h1>
      <div class="divider" />
      <blockquote class="quote">
        <p>Let us go then, you and I.</p>
        <p>When the Eleven-Day Empire eats the sky.</p>
        <p>Like a humanoid melting like clams upon the breakfast table.</p>
      </blockquote>

    </div>
  </div>
</template>

<style scoped>
.Home {
  padding: 64px 24px 96px;
  height:calc(100vh - var(--vp-nav-height));
  text-align: center;
  display:flex;
  flex-direction:column;
  background-image:url("background.jpg");
  background-size:cover;
  background-repeat:no-repeat;
  background-position:center center;
  justify-content: center;
}

@media (min-width: 768px) {
  .Home {
    padding: 96px 32px 168px;
  }

  .banner {
    margin-left: 25vw;
    margin-right: 25vw;
  }
}

@media (max-width: 768px) {
  .banner {
    margin:0px;
  }
}

.banner {
  border-color: white;
  border-radius: 30px;
  border-width: 1px;
  border-style: solid;
  background-color: #32323232;
  backdrop-filter: blur(2px);
  min-height: 30vh;
  justify-content: center;
  display: flex;
  flex-direction: column;
  overflow:hidden;
}


.big-title {
  line-height: 64px;
  font-size: 64px;
  font-weight: 600;
  color:white
}

.title {
  padding-top: 12px;
  letter-spacing: 2px;
  line-height: 20px;
  font-size: 20px;
  font-weight: 700;
  color:white
}

.divider {
  margin: 24px auto 18px;
  width: 64px;
  height: 1px;
  opacity:1;
}

.quote {
  border-top:2px solid white;
  padding-top:10px;
  margin: 0 auto;
  max-width: 512px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-text-2);
  color:white;
}

.action {
  padding-top: 20px;
}

.link {
  display: inline-block;
  border: 1px solid var(--vp-c-brand);
  border-radius: 16px;
  padding: 3px 16px;
  font-size: 14px;
  font-weight: 500;
  color: var(--vp-c-brand);
  transition: border-color 0.25s, color .25s;
}

.link:hover {
  border-color: var(--vp-c-brand-dark);
  color: var(--vp-c-brand-dark);
}
</style>
