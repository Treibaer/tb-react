import React, { Component } from "react";

export function capitalizeFirstLetter(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
type P = React.ComponentProps<"button"> & { ab: string };
export default function Home({ ab, ...props }: P) {
  return null;
}

class Test extends Component<{ name: string }> {
  render() {
    return this.props.name;
  }
}
