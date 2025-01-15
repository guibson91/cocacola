import { animate, animateChild, group, query, style, transition, trigger } from "@angular/animations";

export const slider = trigger("routeAnimations", [
  transition("* <=> *", [
    query(
      ":enter, :leave",
      [
        style({
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
        }),
      ],
      { optional: true },
    ),
    query(":enter", [style({ left: "-100%" })]),
    group([
      query(":leave", [animate("600ms ease", style({ left: "100%" }))], {
        optional: true,
      }),
      query(":enter", [animate("600ms ease", style({ left: "0%" }))]),
    ]),
    // Required for child animations on the page
    query(":leave", animateChild()),
    query(":enter", animateChild()),
  ]),
]);
