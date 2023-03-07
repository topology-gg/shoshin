from dataclasses import dataclass
from typing import Iterator, Any
from apibara.starknet import felt, FieldElement

PRIME = 2**251 + 17 * 2**192 + 1

# Defines all the types necessary for indexing
# of the shoshin contract events

# Convert a FieldElement to an int.
def felt_to_int(it: Iterator[FieldElement]):
    i = felt.to_int(next(it))
    return i if i < PRIME / 2 else -(PRIME - i)


@dataclass
class Vec2:
    x: int
    y: int

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        x = felt_to_int(it)
        y = felt_to_int(it)
        return Vec2(x, y)

    def to_json(self) -> Any:
        return {"x": self.x, "y": self.y}


@dataclass
class Rectangle:
    origin: Vec2
    dimension: Vec2

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        origin = Vec2.from_iter(it)
        dimension = Vec2.from_iter(it)
        return Rectangle(origin, dimension)

    def to_json(self) -> Any:
        return {
            "origin": self.origin.to_json(),
            "dimension": self.dimension.to_json(),
        }


@dataclass
class Hitboxes:
    action: Rectangle
    body: Rectangle

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        action = Rectangle.from_iter(it)
        body = Rectangle.from_iter(it)
        return Hitboxes(action, body)

    def to_json(self) -> Any:
        return {
            "action": self.action.to_json(),
            "body": self.body.to_json(),
        }


@dataclass
class PhysicsState:
    pos: Vec2
    vel_fp: Vec2
    acc_fp: Vec2

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        pos = Vec2.from_iter(it)
        vel_fp = Vec2.from_iter(it)
        acc_fp = Vec2.from_iter(it)
        return PhysicsState(pos, vel_fp, acc_fp)

    def to_json(self) -> Any:
        return {
            "pos": self.pos.to_json(),
            "vel_fp": self.vel_fp.to_json(),
            "acc_fp": self.acc_fp.to_json(),
        }


@dataclass
class BodyState:
    state: int
    counter: int
    integrity: int
    stamina: int
    dir: int
    fatigued: int

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        state = felt_to_int(it)
        counter = felt_to_int(it)
        integrity = felt_to_int(it)
        stamina = felt_to_int(it)
        dir = felt_to_int(it)
        fatigued = felt_to_int(it)
        return BodyState(state, counter, integrity, stamina, dir, fatigued)

    def to_json(self) -> Any:
        return {
            "state": self.state,
            "counter": self.counter,
            "integrity": self.integrity,
            "stamina": self.stamina,
            "dir": self.dir,
            "fatigued": self.fatigued,
        }


@dataclass
class Frame:
    mental_state: int
    body_state: BodyState
    physics_state: PhysicsState
    action: int
    stimulus: int
    hitboxes: Hitboxes

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        mental_state = felt_to_int(it)
        body_state = BodyState.from_iter(it)
        physics_state = PhysicsState.from_iter(it)
        action = felt_to_int(it)
        stimulus = felt_to_int(it)
        hitboxes = Hitboxes.from_iter(it)
        return Frame(
            mental_state, body_state, physics_state, action, stimulus, hitboxes
        )

    def to_json(self) -> Any:
        return {
            "mental_state": self.mental_state,
            "body_state": self.body_state.to_json(),
            "physics_state": self.physics_state.to_json(),
            "action": self.action,
            "stimulus": self.stimulus,
            "hitboxes": self.hitboxes.to_json(),
        }


@dataclass
class FrameScene:
    agent_0: Frame
    agent_1: Frame

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        agent_0 = Frame.from_iter(it)
        agent_1 = Frame.from_iter(it)
        return FrameScene(agent_0, agent_1)

    def to_json(self) -> Any:
        return {
            "agent_0": self.agent_0.to_json(),
            "agent_1": self.agent_1.to_json(),
        }


@dataclass
class EventArray:
    arr: list[FrameScene]

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        arr_len = felt_to_int(it)
        arr = [FrameScene.from_iter(it) for _ in range(arr_len)]
        return EventArray(arr)


@dataclass
class Tree:
    value: int
    left: int
    right: int

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        value = felt_to_int(it)
        left = felt_to_int(it)
        right = felt_to_int(it)
        return Tree(value, left, right)

    def to_json(self) -> Any:
        return {"value": self.value, "left": self.left, "right": self.right}


@dataclass
class EventMetadata:
    combos_offset_0: list[int]
    combos_0: list[int]
    combos_offset_1: list[int]
    combos_1: list[int]
    state_machine_offset_0: list[int]
    state_machine_0: list[Tree]
    initial_state_0: int
    state_machine_offset_1: list[int]
    state_machine_1: list[Tree]
    initial_state_1: int
    functions_offset_0: list[int]
    functions_0: list[Tree]
    functions_offset_1: list[int]
    functions_1: list[Tree]
    actions_0: list[int]
    actions_1: list[int]
    character_0: int
    character_1: int

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        combos_offset_0_len = felt_to_int(it)
        combos_offset_0 = [felt_to_int(it) for _ in range(combos_offset_0_len)]
        combos_0_len = felt_to_int(it)
        combos_0 = [felt_to_int(it) for _ in range(combos_0_len)]
        combos_offset_1_len = felt_to_int(it)
        combos_offset_1 = [felt_to_int(it) for _ in range(combos_offset_1_len)]
        combos_1_len = felt_to_int(it)
        combos_1 = [felt_to_int(it) for _ in range(combos_1_len)]
        state_machine_offset_0_len = felt_to_int(it)
        state_machine_offset_0 = [
            felt_to_int(it) for _ in range(state_machine_offset_0_len)
        ]
        state_machine_0_len = felt_to_int(it)
        state_machine_0 = [Tree.from_iter(it) for _ in range(state_machine_0_len)]
        initial_state_0 = felt_to_int(it)
        state_machine_offset_1_len = felt_to_int(it)
        state_machine_offset_1 = [
            felt_to_int(it) for _ in range(state_machine_offset_1_len)
        ]
        state_machine_1_len = felt_to_int(it)
        state_machine_1 = [Tree.from_iter(it) for _ in range(state_machine_1_len)]
        initial_state_1 = felt_to_int(it)
        functions_offset_0_len = felt_to_int(it)
        functions_offset_0 = [felt_to_int(it) for _ in range(functions_offset_0_len)]
        functions_0_len = felt_to_int(it)
        functions_0 = [Tree.from_iter(it) for _ in range(functions_0_len)]
        functions_offset_1_len = felt_to_int(it)
        functions_offset_1 = [felt_to_int(it) for _ in range(functions_offset_1_len)]
        functions_1_len = felt_to_int(it)
        functions_1 = [Tree.from_iter(it) for _ in range(functions_1_len)]
        action_0_len = felt_to_int(it)
        actions_0 = [felt_to_int(it) for _ in range(action_0_len)]
        action_1_len = felt_to_int(it)
        actions_1 = [felt_to_int(it) for _ in range(action_1_len)]
        character_0 = felt_to_int(it)
        character_1 = felt_to_int(it)
        return EventMetadata(
            combos_offset_0,
            combos_0,
            combos_offset_1,
            combos_1,
            state_machine_offset_0,
            state_machine_0,
            initial_state_0,
            state_machine_offset_1,
            state_machine_1,
            initial_state_1,
            functions_offset_0,
            functions_0,
            functions_offset_1,
            functions_1,
            actions_0,
            actions_1,
            character_0,
            character_1,
        )


@dataclass
class EventSingleMetadata:
    combos_offset: list[int]
    combos: list[int]
    state_machine_offset: list[int]
    state_machine: list[Tree]
    initial_state: int
    functions_offset: list[int]
    functions: list[Tree]
    actions: list[int]
    character: int

    @staticmethod
    def from_iter(it: Iterator[FieldElement]):
        combos_offset_len = felt_to_int(it)
        combos_offset = [felt_to_int(it) for _ in range(combos_offset_len)]
        combos_len = felt_to_int(it)
        combos = [felt_to_int(it) for _ in range(combos_len)]
        state_machine_offset_len = felt_to_int(it)
        state_machine_offset = [
            felt_to_int(it) for _ in range(state_machine_offset_len)
        ]
        state_machine_len = felt_to_int(it)
        state_machine = [Tree.from_iter(it) for _ in range(state_machine_len)]
        initial_state = felt_to_int(it)
        functions_offset_len = felt_to_int(it)
        functions_offset = [felt_to_int(it) for _ in range(functions_offset_len)]
        functions_len = felt_to_int(it)
        functions = [Tree.from_iter(it) for _ in range(functions_len)]
        action_len = felt_to_int(it)
        actions = [felt_to_int(it) for _ in range(action_len)]
        character = felt_to_int(it)
        return EventSingleMetadata(
            combos_offset,
            combos,
            state_machine_offset,
            state_machine,
            initial_state,
            functions_offset,
            functions,
            actions,
            character,
        )
