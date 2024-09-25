import { NextResponse } from 'next/server';

export async function POST(request: Request, context: any) {
  type Data = { lastFocusedExercise: any };
  const data: Data = await request.json();
  if (data.lastFocusedExercise !== null) {
    try {
      const res = await fetch(
        process.env.NEXT_PUBLIC_BASE_URL + '/api/text-generation',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            request: 'video',
            message: data.lastFocusedExercise.question,
          }),
        }
      );
      const resData = await res.json();
      console.log('OpenAi response', resData);

      if (resData) {
        const shotstackRes = await fetch(
          'https://api.shotstack.io/edit/v1/render',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json',
              'x-api-key': process.env.SHOTSTACK_API_KEY!,
            },
            body: JSON.stringify({
              timeline: {
                tracks: [
                  {
                    clips: [
                      {
                        asset: {
                          type: 'caption',
                          src: 'alias://voiceover',
                          font: {
                            color: '#ffffff',
                            family: 'Montserrat ExtraBold',
                            size: 30,
                            lineHeight: 0.8,
                          },
                          margin: {
                            top: 0.25,
                          },
                        },
                        start: 0,
                        length: 'end',
                      },
                    ],
                  },
                  {
                    clips: [
                      {
                        alias: 'voiceover',
                        asset: {
                          type: 'text-to-speech',
                          text: resData.content,
                          voice: 'Joanna',
                        },
                        start: 0,
                        length: 'auto',
                      },
                    ],
                  },
                ],
              },
              output: {
                format: 'mp4',
                size: {
                  width: 1280,
                  height: 720,
                },
              },
            }),
          }
        );
        const renderRes = await shotstackRes.json();
        console.log('Shotstack response', renderRes);
        if (renderRes.success === true) {
          const sleep = (milliseconds: number) => {
            return new Promise((resolve) => setTimeout(resolve, milliseconds));
          };
          let flag = false;
          await sleep(5000);
          do {
            await sleep(10000);
            const response = await fetch(
              '  https://api.shotstack.io/edit/v1/render/' +
                renderRes.response.id,
              {
                method: 'GET',
                headers: {
                  Accept: 'application/json',
                  'Content-Type': 'application/json',
                  'x-api-key': process.env.SHOTSTACK_API_KEY!,
                },
              }
            );
            const json = await response.json();
            console.log('Shotstack response', json);
            if (json.response.url) {
              flag = true;
              return NextResponse.json({
                data: json.response.url,
                name: data.lastFocusedExercise.exercise_name,
              });
            }
          } while (!flag);
        }
      }
      return NextResponse.json({
        message: 'No video generated',
      });
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Error', error });
    }
  } else {
    return NextResponse.json({ message: 'There was no exercise provided' });
  }
}
