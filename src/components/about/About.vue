<template>
  <div class="ma-4 text-center">
    <h1 class="ma-4">Obrigado!</h1>
    <p class="ma-4">Abaixo algumas tecnologias que aprendemos.</p>
    <v-divider class="mb-4"></v-divider>
  </div>
  <v-container>
    <v-row>
      <v-col v-for="(item, index) in items" :key="index" cols="14" sm="8" md="4">
        <AboutCard
          :image="item.image"
          :title="item.title"
          :subtitle="item.subtitle"
          :text="item.text"
        />
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import AboutCard from "@/components/about/AboutCard.vue";
import jwtLogo from "@/assets/jwt.png";  // Import the local image

const items = [
  {
    image: "https://miro.medium.com/v2/resize:fit:1400/format:webp/1*OrjCKmou1jT4It5so5gvOA.jpeg",
    title: "Vue.js",
    subtitle: "The Progressive JavaScript Framework",
    text: "Vue (pronounced /vjuː/, like view) is a JavaScript framework for building user interfaces. It builds on top of standard HTML, CSS, and JavaScript and provides a declarative and component-based programming model that helps you efficiently develop user interfaces, be they simple or complex.",
  },
  {
    image: "https://cdn.vuetifyjs.com/docs/images/logos/vuetify-logo-dark-atom.svg",
    title: "Vuetify 3",
    subtitle: "Incrível biblioteca front-end",
    text: "Learn more about what Vuetify is, how to create an application from scratch, browse API references, sample code, tutorials, and more.",
  },
  {
    image: "https://www.logo.wine/a/logo/Spring_Framework/Spring_Framework-Logo.wine.svg",
    title: "Spring Framework",
    subtitle: "Powerful Java Framework",
    text: "Spring Framework provides a comprehensive programming and configuration model for modern Java-based enterprise applications - on any kind of deployment platform. A key element of Spring is infrastructural support at the application level: Spring focuses on the 'plumbing' of enterprise applications so that teams can focus on application-level business logic, without unnecessary ties to specific deployment environments.",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRd0DOebu67_IcVZnuMjsCuhlbkNG807E8sRg&s",
    title: "PostgreSQL",
    subtitle: "Robust Database System",
    text: "PostgreSQL is a powerful, open source object-relational database system with over 30 years of active development that has earned it a strong reputation for reliability, feature robustness, and performance. It is designed to handle a range of workloads, from single machines to data warehouses or Web services with many concurrent users.",
  },
  {
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSJcC3jqYZoZcgMuRt_bMdo17T-kPNUv06QSA&s",
    title: "Spring Security",
    subtitle: "Secure your Java Applications",
    text: "Spring Security is a powerful and highly customizable authentication and access-control framework. It is the de-facto standard for securing Spring-based applications.",
  },
  {
    image: jwtLogo,  // Use the imported local image
    title: "JWT (JSON Web Token)",
    subtitle: "Secure Token-Based Authentication",
    text: "JWT is an open standard (RFC 7519) that defines a compact and self-contained way for securely transmitting information between parties as a JSON object. This information can be verified and trusted because it is digitally signed.",
  },
];
</script>

<style scoped>
.v-container {
  max-width: 1200px;
  margin: 0 auto;
}
</style>
