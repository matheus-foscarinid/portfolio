<template>
  <section id="about">
    <div class="container appear-on-scroll">
      <h2>About</h2>
      <div class="content-containers">
        <div class="summary">
          <p>
            Hey there, I'm <span class="highlight">Matheus</span>, a fullstack developer based
            in Rio Grande do Sul, Brazil. For me, creating digital products is more than just a job
            - it's a passion. I first discovered this passion while dabbling in graphic design using
            Photoshop, which eventually led me to explore the exciting world of web development.
          </p>
          <p>
            With <span class="highlight">3 years of experience</span> under my belt, I'm always
            eager to learn and expand my skillset. I'm particularly interested in
            <span class="highlight">design patterns and principles</span>, and strive to apply them
            in all of my work.
          </p>
          <p>
            My journey began as a <span class="highlight">trainee working with Ruby on Rails</span>,
            and I've since broadened my horizons to include technologies such as Vue and NestJS. I
            love the challenge of creating
            <span class="highlight">user-centric applications</span> that solve real-world problems,
            and I take great pride in delivering products that are not only functional, but also
            visually appealing.
          </p>
          <p>
            When I'm not coding, you can usually find me keeping up-to-date with the
            <span class="highlight">latest industry trends</span> or experimenting with new tools
            and frameworks. Thanks for stopping by and getting to know me a little better!
          </p>
        </div>

        <div class="tech-stack">
          <h3>Tech Stack</h3>
          <div class="stacks-container">
            <StackCard 
              v-for="stack in stacks"
              :key="stack.name"
              :name="stack.name"
              :type="stack.type"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import StackCard from '@/components/cards/StackCard.vue';
const stacks = [
  { name: 'html5', type: 'original'},
  { name: 'css3', type: 'original'},
  { name: 'javascript', type: 'original'},
  { name: 'typescript', type: 'original'},
  { name: 'vuejs', type: 'original'},
  { name: 'nodejs', type: 'original'},
  { name: 'nestjs', type: 'plain'},
  { name: 'mysql', type: 'original'},
  { name: 'git', type: 'original'},
  { name: 'rails', type: 'original-wordmark'}
];

</script>

<style lang="scss" scoped>
#about {
  min-height: 70vh;
  display: flex;
  justify-content: center;
  flex-direction: column;
  background: white;

  h2 {
    display: flex;
    align-items: center;
    font-size: 1.5rem;
    font-weight: 700;
    margin-bottom: 1rem;
    color: var(--secondary-text);

    &::before {
      content: '';
      display: block;
      position: relative;
      width: 50px;
      height: 1px;
      margin-right: 20px;
      background-color: var(--default-border);
    }
    &::after {
      content: '';
      display: block;
      position: relative;
      width: 530px;
      height: 1px;
      margin-left: 20px;
      background-color: var(--default-border);
    }
  }

  .content-containers {
    display: flex;
    gap: 5rem;

    .summary {
      max-width: 700px;

      .highlight {
        color: var(--primary-text);
        font-weight: 700;
      }
    }

    .tech-stack {
      .stacks-container {
        display: flex;
        flex-wrap: wrap;
        gap: 1rem;
      }

      h3 {
        display: flex;
        align-items: center;
        font-size: 1.5rem;
        font-weight: 700;
        margin-bottom: 1rem;
        color: var(--secondary-text);

        &::before {
          content: '';
          display: block;
          position: relative;
          width: 120px;
          height: 1px;
          margin-right: 20px;
          background-color: var(--default-border);
        }
        &::after {
          content: '';
          display: block;
          position: relative;
          width: 50px;
          height: 1px;
          margin-left: 20px;
          background-color: var(--default-border);
        }
      }
    }
  }
}

@media (max-width: 768px) {
  #about {

    h2 {
      &::before, &::after {
        width: 50%;
      }
    }
    .content-containers {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
