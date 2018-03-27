import React, { Component } from 'react';
import styled from 'styled-components';

import Particles from '../Confetti/Particles';
import Confetti from '../Confetti';
import Slider from '../Slider';

class ConfettiManager extends Component {
  state = {
    numParticles: 160,
    gravity: 0,
    speed: 100,
    scale: 0.5,
    spin: 0,
    twist: 0,
  };

  updateVal = key => value => this.setState({ [key]: value });

  render() {
    const { numParticles, gravity, speed, scale, spin, twist } = this.state;

    return (
      <Wrapper>
        {/* TODO: Use WindowDimensions to get width/height */}
        <Particles
          width={920}
          height={620}
          numParticles={numParticles}
          gravity={gravity}
          minSpeed={speed}
          maxSpeed={speed * 3}
          minScale={scale}
          maxScale={scale * 2}
          spin={spin}
          twist={twist}
        >
          {({ particles, status, generateParticles }) => (
            <ConfettiContainer onClick={generateParticles}>
              <Confetti particles={particles} width={920} height={620} />
            </ConfettiContainer>
          )}
        </Particles>

        <Controls>
          <Slider
            width={200}
            label="Gravity"
            min={0}
            max={4000}
            value={gravity}
            onChange={this.updateVal('gravity')}
          />
          <Slider
            width={200}
            label="Speed"
            min={0}
            max={1000}
            value={speed}
            onChange={this.updateVal('speed')}
          />
          <Slider
            width={200}
            label="Scale"
            min={0.1}
            max={2.5}
            step={0.1}
            value={scale}
            onChange={this.updateVal('scale')}
          />
          <Slider
            width={200}
            label="Spin"
            min={0}
            max={60}
            value={spin}
            onChange={this.updateVal('spin')}
          />
          <Slider
            width={200}
            label="Twist"
            min={0}
            max={60}
            value={twist}
            onChange={this.updateVal('twist')}
          />
          <Slider
            width={200}
            label="# of Particles"
            min={10}
            max={200}
            value={numParticles}
            onChange={this.updateVal('numParticles')}
          />
        </Controls>
      </Wrapper>
    );
  }
}

const Wrapper = styled.div`
  position: relative;
  outline: 1px solid;
`;

const ConfettiContainer = styled.div`
  position: relative;
  z-index: 1;
`;

const Controls = styled.div`
  position: absolute;
  padding: 25px 50px;
  top: 0;
  right: 0;
  z-index: 2;
`;

export default ConfettiManager;
