export const sectionBackgrounds = {
  activities: "#294A2F",
  trails: "#84ab86",
  events: "#71856a",
  posts: "#F2FAF4",
  mobile: "#84ab86",
};

export const sections = [
  {
    key: "activities",
    title: "Aktywności",
    description: "Pokonaj własną trasę i modyfikuj ją w swoim panelu",
    path: "/activities",
    bgColor: "bg-background",
    iconColor: "text-primary",
    buttonText: "Sprawdź swoje aktywności",
    image: "publish_acitivity.png",
    textColor: "text-white",
    imageHeight: "h-[400px]",
  },
  {
    key: "trails",
    title: "Mapa tras",
    description:
      "Odkryj nowe szlaki i trasy udostępnione przez innych użytkowników",
    path: "/trails",
    bgColor: "bg-white",
    buttonText: "Eksploruj szlaki",
    image: "map.png",
    textColor: "text-white",
    imageHeight: "h-[600px]",
  },
  {
    key: "events",
    title: "Wydarzenia",
    description:
      "Znajdź nadchodzące wydarzenia w Twojej okolicy i zapisz się do nich już dziś!",
    path: "/events",
    bgColor: "bg-background",
    buttonText: "Sprawdź wydarzenia",
    image: "event.png",
    textColor: "text-white",
  },
  {
    key: "posts",
    title: "Blog",
    description:
      "Podziel się swoimi doświadczeniami i historiami lub sprawdź co mają do powiedzenia inni",
    path: "/blog",
    bgColor: "bg-white",
    buttonText: "Zobacz posty",
    image: "post.png",
    textColor: "text-dark",
    imageHeight: "h-[400px]",
  },
  {
    key: "mobile",
    title: "Aplikcja mobilna",
    description:
      "Wyrusz na wędrówkę, nagraj trasę za pomocą aplikacji mobilnej i udostępniaj ją innym użytkownikom!",
    path: "/download-app",
    bgColor: "bg-white",
    buttonText: "Pobierz tutaj!",
    image: "appScreenshot.png",
    textColor: "text-white",
    imageHeight: "h-[600px]",
  },
];
