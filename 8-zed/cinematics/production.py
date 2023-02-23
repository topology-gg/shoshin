import pygame
import numpy as np
import time
import json
from timeit import default_timer as timer

PRIME = 3618502788666131213697322783095070105623107215331596699973092056135872020481
PRIME_HALF = PRIME // 2

FRAME_PERIOD = 0.5
# FRAME_PERIOD = 0.07


def draw_background():
    target_rect = pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    screen.blit(BG, target_rect)

    # """ Draw a horizontal-gradient filled rectangle covering <target_rect> """
    # target_rect = pygame.Rect(0, 0, SCREEN_WIDTH, SCREEN_HEIGHT)
    # color_rect = pygame.Surface( (2,2) )
    # pygame.draw.line( color_rect, BG_TOP_COLOR,  (0,0), (1,0) ) # top color line
    # pygame.draw.line( color_rect, BG_BOTTOM_COLOR, (0,1), (1,1) ) # bottom color line
    # color_rect = pygame.transform.smoothscale( color_rect, (target_rect.width,target_rect.height ) )  # stretch
    # screen.blit( color_rect, target_rect ) # paint


def update_game_message(message):
    font = pygame.font.Font(None, 22)
    text = font.render(message, 1, (255, 255, 255))
    text_rect = text.get_rect(
        center=(SCREEN_WIDTH / 2, SCREEN_HEIGHT + GAME_TEXT_HEIGHT / 2)
    )
    screen.fill((30, 30, 30), (0, SCREEN_HEIGHT, SCREEN_WIDTH, GAME_TEXT_HEIGHT))
    screen.blit(text, text_rect)
    # pygame.display.update()


def update_stat_message(message):
    font = pygame.font.Font(None, 22)
    text = font.render(message, 1, (255, 255, 255))
    text_rect = text.get_rect(
        center=(
            SCREEN_WIDTH / 2,
            SCREEN_HEIGHT + GAME_TEXT_HEIGHT + STAT_TEXT_HEIGHT / 2,
        )
    )
    screen.fill(
        (1, 1, 1), (0, SCREEN_HEIGHT + GAME_TEXT_HEIGHT, SCREEN_WIDTH, STAT_TEXT_HEIGHT)
    )
    screen.blit(text, text_rect)
    # pygame.display.update()


def adjust_from_felt(felt):
    if felt > PRIME_HALF:
        return felt - PRIME
    else:
        return felt


def adjust_from_felt_array(felt_array):
    return [adjust_from_felt(felt) for felt in felt_array]


#
# scene setup
#
BG = pygame.image.load("../7-demo/cinematics/assets/bg/grid/white_wide.png")
BG_H = BG.get_height()
BG_W = BG.get_width()
CHAR_OFFSET = 5

SCREEN_WIDTH = BG_W  # old: 800
SCREEN_CENTER = SCREEN_WIDTH / 2
SCREEN_HEIGHT = BG_H  # old: 200

COLOR_LEMON = (255, 231, 107)
COLOR_TAN = (240, 143, 62)
COLOR_BURNT = (229, 78, 48)
COLOR_CREAM = (255, 248, 211)
COLOR_GRAY = (85, 74, 82)

GAME_TEXT_HEIGHT = 75
STAT_TEXT_HEIGHT = 75
SCREEN_HEIGHT_TOTAL = SCREEN_HEIGHT + GAME_TEXT_HEIGHT + STAT_TEXT_HEIGHT

BG_TOP_COLOR = COLOR_CREAM  # (132,203,185)
BG_BOTTOM_COLOR = COLOR_CREAM  # (201,230,225)

HITBOX_ALPHA = 50

#
# Initialize pygame
#
pygame.init()
pygame.display.set_caption("Game Testing")
screen = pygame.display.set_mode((SCREEN_WIDTH, SCREEN_HEIGHT_TOTAL))
draw_background()
update_game_message("Shoshin milestone #6: Loco")
update_stat_message("")

pygame.display.update()


#
# Import fight record
#
f = open("artifacts/test_engine.json")
json_str = json.load(f)
record = json.loads(json_str)
n_frames = len(record["agent_0"]["frames"])

for frame in record["agent_0"]["frames"]:
    print(frame["body_state"]["state"], frame["body_state"]["counter"])
print()
# for frame in record ['agent_1']:
# 	print (frame['object_state'], end=' ')
# print()

SPRITES_JESSICA = {
    0: pygame.image.load("../art/jessica/idle/frame_0.png"),
    1: pygame.image.load("../art/jessica/idle/frame_1.png"),
    2: pygame.image.load("../art/jessica/idle/frame_2.png"),
    3: pygame.image.load("../art/jessica/idle/frame_3.png"),
    4: pygame.image.load("../art/jessica/idle/frame_4.png"),
    10: pygame.image.load("../art/jessica/slash/frame_0.png"),
    11: pygame.image.load("../art/jessica/slash/frame_1.png"),
    12: pygame.image.load("../art/jessica/slash/frame_2.png"),
    13: pygame.image.load("../art/jessica/slash/frame_3.png"),
    14: pygame.image.load("../art/jessica/slash/frame_4.png"),
    20: pygame.image.load("../art/jessica/upswing/frame_0.png"),
    21: pygame.image.load("../art/jessica/upswing/frame_1.png"),
    22: pygame.image.load("../art/jessica/upswing/frame_2.png"),
    23: pygame.image.load("../art/jessica/upswing/frame_3.png"),
    24: pygame.image.load("../art/jessica/upswing/frame_4.png"),
    30: pygame.image.load("../art/jessica/sidecut/frame_0.png"),
    31: pygame.image.load("../art/jessica/sidecut/frame_1.png"),
    32: pygame.image.load("../art/jessica/sidecut/frame_2.png"),
    33: pygame.image.load("../art/jessica/sidecut/frame_3.png"),
    34: pygame.image.load("../art/jessica/sidecut/frame_4.png"),
    40: pygame.image.load("../art/jessica/block/frame_0.png"),
    41: pygame.image.load("../art/jessica/block/frame_1.png"),
    42: pygame.image.load("../art/jessica/block/frame_2.png"),
    50: pygame.image.load("../art/jessica/clash/frame_0.png"),
    51: pygame.image.load("../art/jessica/clash/frame_1.png"),
    52: pygame.image.load("../art/jessica/clash/frame_2.png"),
    53: pygame.image.load("../art/jessica/clash/frame_3.png"),
    60: pygame.image.load("../art/jessica/hurt/frame_0.png"),
    61: pygame.image.load("../art/jessica/hurt/frame_1.png"),
    62: pygame.image.load("../art/jessica/hurt/frame_2.png"),
    70: pygame.image.load("../art/jessica/knocked/frame_0.png"),
    71: pygame.image.load("../art/jessica/knocked/frame_1.png"),
    72: pygame.image.load("../art/jessica/knocked/frame_2.png"),
    73: pygame.image.load("../art/jessica/knocked/frame_3.png"),
    74: pygame.image.load("../art/jessica/knocked/frame_4.png"),
    75: pygame.image.load("../art/jessica/knocked/frame_5.png"),
    76: pygame.image.load("../art/jessica/knocked/frame_6.png"),
    77: pygame.image.load("../art/jessica/knocked/frame_7.png"),
    78: pygame.image.load("../art/jessica/knocked/frame_8.png"),
    79: pygame.image.load("../art/jessica/knocked/frame_9.png"),
    80: pygame.image.load("../art/jessica/knocked/frame_10.png"),
    81: pygame.image.load("../art/jessica/knocked/frame_11.png"),
    90: pygame.image.load("../art/jessica/walk_forward/frame_0.png"),
    91: pygame.image.load("../art/jessica/walk_forward/frame_1.png"),
    92: pygame.image.load("../art/jessica/walk_forward/frame_2.png"),
    93: pygame.image.load("../art/jessica/walk_forward/frame_3.png"),
    94: pygame.image.load("../art/jessica/walk_forward/frame_4.png"),
    95: pygame.image.load("../art/jessica/walk_forward/frame_5.png"),
    96: pygame.image.load("../art/jessica/walk_forward/frame_6.png"),
    97: pygame.image.load("../art/jessica/walk_forward/frame_7.png"),
    100: pygame.image.load("../art/jessica/walk_backward/frame_0.png"),
    101: pygame.image.load("../art/jessica/walk_backward/frame_1.png"),
    102: pygame.image.load("../art/jessica/walk_backward/frame_2.png"),
    103: pygame.image.load("../art/jessica/walk_backward/frame_3.png"),
    104: pygame.image.load("../art/jessica/walk_backward/frame_4.png"),
    105: pygame.image.load("../art/jessica/walk_backward/frame_5.png"),
    110: pygame.image.load("../art/jessica/dash_forward/frame_0.png"),
    111: pygame.image.load("../art/jessica/dash_forward/frame_1.png"),
    112: pygame.image.load("../art/jessica/dash_forward/frame_2.png"),
    113: pygame.image.load("../art/jessica/dash_forward/frame_3.png"),
    114: pygame.image.load("../art/jessica/dash_forward/frame_4.png"),
    120: pygame.image.load("../art/jessica/dash_backward/frame_0.png"),
    121: pygame.image.load("../art/jessica/dash_backward/frame_1.png"),
    122: pygame.image.load("../art/jessica/dash_backward/frame_2.png"),
    123: pygame.image.load("../art/jessica/dash_backward/frame_3.png"),
    124: pygame.image.load("../art/jessica/dash_backward/frame_4.png"),
}

SPRITES_ANTOC = {
    0: pygame.image.load("../art/antoc/antoc-idle/frame_0.png"),
    1: pygame.image.load("../art/antoc/antoc-idle/frame_1.png"),
    2: pygame.image.load("../art/antoc/antoc-idle/frame_2.png"),
    3: pygame.image.load("../art/antoc/antoc-idle/frame_3.png"),
    4: pygame.image.load("../art/antoc/antoc-idle/frame_4.png"),
    10: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_0.png"),
    11: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_1.png"),
    12: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_2.png"),
    13: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_3.png"),
    14: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_4.png"),
    15: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_5.png"),
    16: pygame.image.load("../art/antoc/antoc-attack-hori-from-idle/frame_6.png"),
    20: pygame.image.load("../art/antoc/antoc-attack-vert/frame_0.png"),
    21: pygame.image.load("../art/antoc/antoc-attack-vert/frame_1.png"),
    22: pygame.image.load("../art/antoc/antoc-attack-vert/frame_2.png"),
    23: pygame.image.load("../art/antoc/antoc-attack-vert/frame_3.png"),
    24: pygame.image.load("../art/antoc/antoc-attack-vert/frame_4.png"),
    25: pygame.image.load("../art/antoc/antoc-attack-vert/frame_5.png"),
    26: pygame.image.load("../art/antoc/antoc-attack-vert/frame_6.png"),
    27: pygame.image.load("../art/antoc/antoc-attack-vert/frame_7.png"),
    28: pygame.image.load("../art/antoc/antoc-attack-vert/frame_8.png"),
    29: pygame.image.load("../art/antoc/antoc-attack-vert/frame_9.png"),
    40: pygame.image.load("../art/antoc/antoc-block/frame_0.png"),
    41: pygame.image.load("../art/antoc/antoc-block/frame_1.png"),
    42: pygame.image.load("../art/antoc/antoc-block/frame_2.png"),
    43: pygame.image.load("../art/antoc/antoc-block/frame_3.png"),
    44: pygame.image.load("../art/antoc/antoc-block/frame_4.png"),
    45: pygame.image.load("../art/antoc/antoc-block/frame_5.png"),
    50: pygame.image.load("../art/antoc/antoc-hurt/frame_0.png"),
    51: pygame.image.load("../art/antoc/antoc-hurt/frame_1.png"),
    52: pygame.image.load("../art/antoc/antoc-hurt/frame_2.png"),
    60: pygame.image.load("../art/antoc/antoc-knocked/frame_0.png"),
    61: pygame.image.load("../art/antoc/antoc-knocked/frame_1.png"),
    62: pygame.image.load("../art/antoc/antoc-knocked/frame_2.png"),
    63: pygame.image.load("../art/antoc/antoc-knocked/frame_3.png"),
    64: pygame.image.load("../art/antoc/antoc-knocked/frame_4.png"),
    65: pygame.image.load("../art/antoc/antoc-knocked/frame_5.png"),
    66: pygame.image.load("../art/antoc/antoc-knocked/frame_6.png"),
    67: pygame.image.load("../art/antoc/antoc-knocked/frame_7.png"),
    68: pygame.image.load("../art/antoc/antoc-knocked/frame_8.png"),
    69: pygame.image.load("../art/antoc/antoc-knocked/frame_9.png"),
    70: pygame.image.load("../art/antoc/antoc-knocked/frame_10.png"),
    90: pygame.image.load("../art/antoc/antoc-forward-walk/frame_0.png"),
    91: pygame.image.load("../art/antoc/antoc-forward-walk/frame_1.png"),
    92: pygame.image.load("../art/antoc/antoc-forward-walk/frame_2.png"),
    93: pygame.image.load("../art/antoc/antoc-forward-walk/frame_3.png"),
    94: pygame.image.load("../art/antoc/antoc-forward-walk/frame_4.png"),
    95: pygame.image.load("../art/antoc/antoc-forward-walk/frame_5.png"),
    96: pygame.image.load("../art/antoc/antoc-forward-walk/frame_6.png"),
    100: pygame.image.load("../art/antoc/antoc-backward-walk/frame_0.png"),
    101: pygame.image.load("../art/antoc/antoc-backward-walk/frame_1.png"),
    102: pygame.image.load("../art/antoc/antoc-backward-walk/frame_2.png"),
    103: pygame.image.load("../art/antoc/antoc-backward-walk/frame_3.png"),
    104: pygame.image.load("../art/antoc/antoc-backward-walk/frame_4.png"),
    105: pygame.image.load("../art/antoc/antoc-backward-walk/frame_5.png"),
    110: pygame.image.load("../art/antoc/antoc-forward-dash/frame_0.png"),
    111: pygame.image.load("../art/antoc/antoc-forward-dash/frame_1.png"),
    112: pygame.image.load("../art/antoc/antoc-forward-dash/frame_2.png"),
    113: pygame.image.load("../art/antoc/antoc-forward-dash/frame_3.png"),
    114: pygame.image.load("../art/antoc/antoc-forward-dash/frame_4.png"),
    115: pygame.image.load("../art/antoc/antoc-forward-dash/frame_5.png"),
    116: pygame.image.load("../art/antoc/antoc-forward-dash/frame_6.png"),
    117: pygame.image.load("../art/antoc/antoc-forward-dash/frame_7.png"),
    118: pygame.image.load("../art/antoc/antoc-forward-dash/frame_8.png"),
    120: pygame.image.load("../art/antoc/antoc-backward-dash/frame_0.png"),
    121: pygame.image.load("../art/antoc/antoc-backward-dash/frame_1.png"),
    122: pygame.image.load("../art/antoc/antoc-backward-dash/frame_2.png"),
    123: pygame.image.load("../art/antoc/antoc-backward-dash/frame_3.png"),
    124: pygame.image.load("../art/antoc/antoc-backward-dash/frame_4.png"),
    125: pygame.image.load("../art/antoc/antoc-backward-dash/frame_5.png"),
    126: pygame.image.load("../art/antoc/antoc-backward-dash/frame_6.png"),
    127: pygame.image.load("../art/antoc/antoc-backward-dash/frame_7.png"),
    128: pygame.image.load("../art/antoc/antoc-backward-dash/frame_8.png"),
}

STATES_HIT = [60, 61, 62]

STATES_SIDECUT = [30, 31, 32, 33, 34]

STATES_DASH = [110, 111, 112, 113, 114, 120, 121, 122, 123, 124]

STATES_PUNCH = [10, 11, 12, 13, 14, 20, 21, 22, 23, 24]


def draw_character(frame, character_type, flip):

    #
    # Extract info from frame
    #
    state = frame["body_state"]["state"]
    counter = frame["body_state"]["counter"]
    x = frame["physics_state"]["pos"]['x']
    y = frame["physics_state"]["pos"]['y']

    #
    # Adjust from felt
    #
    [x, y] = [adjust_from_felt(x), adjust_from_felt(y)]

    #
    # Convert info into render-view info
    #
    offset = state + counter
    sprite = SPRITES_JESSICA[offset] if not character_type else SPRITES_ANTOC[offset]
    char_x = x + 0.5 * SCREEN_WIDTH
    char_y = SCREEN_HEIGHT - y - sprite.get_height() - CHAR_OFFSET

    #
    # Adjustment for hit sprite's x location
    #
    X_OFFSET = 25
    Y_OFFSET = 8

    if state not in STATES_DASH:
        char_y += Y_OFFSET

    if flip == 0:  # not flipped
        char_x -= X_OFFSET

        if state in STATES_HIT:  # adjust for hit sprite shifts
            char_x -= 20

        if state in STATES_SIDECUT:
            char_x -= 25

    else:  # flipped
        char_x -= X_OFFSET - 4

        if (
            state in STATES_PUNCH
        ):  # adjust for punch sprite shifts when mirrored horizontally
            char_x -= 47

    # print(state, char_x, char_y)
    #
    # Draw character sprite
    #
    screen.blit(pygame.transform.flip(sprite, flip, False), (char_x, char_y))


def draw_debug(frame, flip):

    #
    # Extract info from frame
    #
    state = frame["body_state"]["state"]

    action_x = frame["hitboxes"]["action"]["origin"]["x"]
    action_y = frame["hitboxes"]["action"]["origin"]["y"]
    action_w = frame["hitboxes"]["action"]["dimension"]["x"]
    action_h = frame["hitboxes"]["action"]["dimension"]["y"]

    body_x = frame["hitboxes"]["body"]["origin"]["x"]
    body_y = frame["hitboxes"]["body"]["origin"]["y"]
    body_w = frame["hitboxes"]["body"]["dimension"]["x"]
    body_h = frame["hitboxes"]["body"]["dimension"]["y"]

    #
    # Adjust from felt
    #
    [action_x, action_y] = adjust_from_felt_array([action_x, action_y])
    [action_w, action_h] = adjust_from_felt_array([action_w, action_h])
    [body_x, body_y] = adjust_from_felt_array([body_x, body_y])
    [body_w, body_h] = adjust_from_felt_array([body_w, body_h])

    #
    # Convert info into render-view info
    #
    action_x = action_x + 0.5 * SCREEN_WIDTH
    body_x = body_x + 0.5 * SCREEN_WIDTH
    action_y = SCREEN_HEIGHT - action_y - action_h - CHAR_OFFSET
    body_y = SCREEN_HEIGHT - body_y - body_h - CHAR_OFFSET

    # print (f'state: {state}, action: ({action_x}, {action_y}) / body: ({body_x}, {body_y})')

    #
    # Draw body hitbox
    # credit for drawing transparent objects:
    # - https://stackoverflow.com/questions/6339057/draw-a-transparent-rectangles-and-polygons-in-pygame
    #
    body_hitbox = pygame.Surface((body_w, body_h), pygame.SRCALPHA)  # per-pixel alpha
    body_hitbox.fill((255, 231, 107, HITBOX_ALPHA))
    screen.blit(pygame.transform.flip(body_hitbox, flip, False), (body_x, body_y))

    #
    # draw action hitbox
    #
    action_hitbox = pygame.Surface(
        (action_w, action_h), pygame.SRCALPHA
    )  # per-pixel alpha
    action_hitbox.fill((229, 78, 48, HITBOX_ALPHA))

    # if flip == 0: ## not flipped
    # 	offset = BODY_HITBOX_W
    # else:
    # 	offset = -PUNCH_HITBOX_W

    screen.blit(action_hitbox, (action_x, action_y))
    # print (f'action hitbox (x,y,w,h) = ({action_x}, {action_y}, {action_w}, {action_h})')


#
# Main loop
#
idx = 0
while True:

    #
    # Draw background (reset scene)
    #
    draw_background()

    for agent_idx in [0, 1]:
        frames = record[f"agent_{agent_idx}"]["frames"]
        character_type = record[f"agent_{agent_idx}"]["type"]
        frame = frames[idx]

        #
        # Draw agent
        #
        draw_character(frame, character_type, flip=0)

        #
        # Draw debug view
        #
        # print(agent_idx)
        # draw_debug (frame, flip=agent_idx)
        # print()

    # int_0 = record['agent_0'][idx]['character_state']['int']
    # int_1 = record['agent_1'][idx]['character_state']['int']
    obj_0 = record["agent_0"]["frames"][idx]["body_state"]["state"]
    obj_1 = record["agent_1"]["frames"][idx]["body_state"]["state"]
    # update_stat_message(f'player 0 integrity : {int_0} / player 1 integrity : {int_1}')
    update_stat_message(
        f"player 0 object_state : {obj_0} / player 1 object_state : {obj_1}"
    )

    #
    # Pygame update scene
    #
    pygame.display.update()

    #
    # Delay for frame period and increment frame index
    #
    # time.sleep (42 / 1000) # 1s / 24 ~= 42ms
    time.sleep(FRAME_PERIOD)
    idx = (idx + 1) % n_frames
