import { Modal, ModalProps, ModalBaseProps } from '@mantine/core';
import { ClaudeRecommendation, ClaudeOtherTeam } from '../../types/types';
import Image from 'next/image';

interface RecommendationModalProps extends ModalProps {
  recommendation: ClaudeRecommendation;
  opened: ModalBaseProps['opened'];
  onClose: ModalBaseProps['onClose'];
  title: string;
}

const RecommendationModal: React.FC<RecommendationModalProps> = ({
  recommendation,
  opened,
  onClose,
  title,
}) => {
  const suggestions = recommendation?.suggestions;
  return (
    <Modal opened={opened} onClose={onClose} size={'xl'}>
      <div>
        <h1 className="text-2xl font-bold p-4">{title}</h1>
        {suggestions?.map((suggestion, index: number) => (
          <div key={index}>
            <div className="grid grid-cols-2 grid-cols-[50%_50%] px-4">
              <div>
                <h1 className="text-xl pb-4">You send: </h1>

                {suggestion.userTeam.sends.map((player, index: number) => (
                  <div key={index}>
                    <Image
                      src={`https://sleepercdn.com/content/nfl/players/thumb/${player.playerId}.jpg`}
                      alt="headshot"
                      width={150}
                      height={150}
                    />
                    <p className="text-lg">
                      {player.playerName} - {player.position} - {player.value}
                    </p>
                  </div>
                ))}
              </div>

              <div>
                <h1 className="text-xl pb-4">They send: </h1>
                {suggestion.otherTeam.sends.map((player, index: number) => (
                  <div className="flex flex-col" key={index}>
                    <Image
                      src={`https://sleepercdn.com/content/nfl/players/thumb/${player.playerId}.jpg`}
                      alt="headshot"
                      width={150}
                      height={150}
                    />
                    <p className="text-lg">
                      {player.playerName} - {player.position} - {player.value}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-center pt-12 pb-6 text-lg">
              {suggestion.rationale}
            </div>
            <hr className="border border-2 border-black mb-12" />
          </div>
        ))}
      </div>
    </Modal>
  );
};
export default RecommendationModal;
